import Player from '../actors/Player';
import Cpu from '../actors/Cpu';
import Paddle from '../prefabs/Paddle';
import Ball from '../prefabs/Ball';

interface IPaddlePositions {
    yBoundries: { min: number, max: number };
    xPositions: [{side: string, x: number}, {side: string, x: number}];
    yPosition: number;
    [key: string]: any;
}

interface ILabelsConfig {
    font: string;
    size: number;
    position: {
        left: {
            score: { x: number, y: number },
            name: { x: number, y: number},
            anchor: {x: number, y: number}
        },
        right: {
            score: { x: number, y: number },
            name: { x: number, y: number},
            anchor: {x: number, y: number}
        }
        [key: string]: any;
    };
    [key: string]: any;
}

interface ILabels {
    score: { player: Phaser.BitmapText, cpu: Phaser.BitmapText };
    name: { player: Phaser.BitmapText, cpu: Phaser.BitmapText};
    [key: string]: any;
}

class Play extends Phaser.State {
    [key: string]: any
    constructor(
        public __player: Player,
        public __cpu: Cpu,
        public __ball: Ball,
        public __level: Phaser.Tilemap,
        public __walls: Phaser.TilemapLayer,
        public __leftTarget: Phaser.TilemapLayer,
        public __rightTarget: Phaser.TilemapLayer,
        public __labels: ILabels,
        public __labelsConfig: ILabelsConfig,
        public __paddlePositions: IPaddlePositions,
        public __availableXpositions: [{side: string, x: number}, {side: string, x: number}],
        public __roundScore: { player: number, cpu: number, target: number },
        public __roundStarted: boolean,
        public __gameOver: boolean,
        public __endGameDelay = 3000
    ) {
        super();
    }

    create(): void {
        this.add.image(0, 0, 'background');
        this.__labelsConfig = {
            font: 'AmigaTopazA600',
            size: 24,
            position: {
                left: {
                    score: { x: 20, y: 80 },
                    name: { x: 20, y: 40},
                    anchor: {x: 0, y: 0}
                },
                right: {
                    score: { x: 620, y: 80 },
                    name: { x: 620, y: 40},
                    anchor: {x: 1, y: 0}
                }
            }
        };
        this.__paddlePositions = {
            yPosition: 180,
            xPositions: [{side: 'left', x: 120}, {side: 'right', x: 520}],
            yBoundries: { min: 20, max: 340 }
        },
        this.__availableXpositions = JSON.parse(JSON.stringify(this.__paddlePositions.xPositions));
        this.__roundScore = { player: 0, cpu: 0, target: 11 };
        this.__roundStarted = false;
        this.__gameOver = false;
        this.input.onDown.add(this.__startRound, this);
        this.__buildLevel();
        this.__spawnPlayer();
        this.__spawnCpu();
        this.__spawnBall();
        this.__buildUi();
    }

    update(): void {
        this.game.physics.arcade.collide(this.__cpu, this.__walls);
        this.game.physics.arcade.collide(this.__ball, this.__walls);

        this.game.physics.arcade.collide(this.__ball, this.__leftTarget, this.__onBallLost, undefined, this);
        this.game.physics.arcade.collide(this.__ball, this.__rightTarget, this.__onBallLost, undefined, this);

        this.game.physics.arcade.collide(this.__ball, this.__player, this.__onBallVsPaddle, undefined, this);
        this.game.physics.arcade.collide(this.__ball, this.__cpu, this.__onBallVsPaddle, undefined, this);

        this.__watchScore();
    }

    __buildLevel(): void {
        this.__level = this.add.tilemap('stage');
        this.__level.addTilesetImage('tileset');
        this.__level.layers.forEach(layer => {
            (<Phaser.TilemapLayer>this[`__${layer.name}`]) = this.__level.createLayer(layer.name);
            this.__level.setCollisionByExclusion([-1], true, layer.name);
        });
        this.__leftTarget.alpha = 0;
        this.__rightTarget.alpha = 0;
    }

    __spawnPlayer(): void {
        let position = this.__pickPosition();
        this.__player = new Player({
            state: this,
            game: this.game,
            texture: 'paddle',
            name: 'player',
            side: position.side,
            yBoundries: this.__paddlePositions.yBoundries,
            x: position.x,
            y: this.__paddlePositions.yPosition
        });
        this.add.existing(this.__player);
    }

    __spawnCpu(): void {
        let position = this.__pickPosition();
        this.__cpu = new Cpu({
            state: this,
            game: this.game,
            texture: 'paddle',
            name: 'cpu',
            side: position.side,
            yBoundries: this.__paddlePositions.yBoundries,
            x: position.x,
            y: this.__paddlePositions.yPosition
        });
        this.add.existing(this.__cpu);
    }

    __spawnBall(): void {
        this.__ball = new Ball({
            state: this,
            game: this.game,
            texture: 'ball',
            name: 'ball',
            x: this.world.centerX,
            y: this.world.centerY
        });
        this.add.existing(this.__ball);
    }

    __buildUi(): void {
        const playerNameLabel = this.add.bitmapText(
            this.__labelsConfig.position[this.__player.__side].name.x,
            this.__labelsConfig.position[this.__player.__side].name.y,
            this.__labelsConfig.font,
            this.__player.__name.toUpperCase(),
            this.__labelsConfig.size
        );
        playerNameLabel.anchor.set(
            this.__labelsConfig.position[this.__player.__side].anchor.x,
            this.__labelsConfig.position[this.__player.__side].anchor.y
        );

        const cpuNameLabel = this.add.bitmapText(
            this.__labelsConfig.position[this.__cpu.__side].name.x,
            this.__labelsConfig.position[this.__cpu.__side].name.y,
            this.__labelsConfig.font,
            this.__cpu.__name.toUpperCase(),
            this.__labelsConfig.size
        );
        cpuNameLabel.anchor.set(
            this.__labelsConfig.position[this.__cpu.__side].anchor.x,
            this.__labelsConfig.position[this.__cpu.__side].anchor.y
        );

        const playerScoreLabel = this.add.bitmapText(
            this.__labelsConfig.position[this.__player.__side].score.x,
            this.__labelsConfig.position[this.__player.__side].score.y,
            this.__labelsConfig.font,
            this.__roundScore.player.toString(),
            this.__labelsConfig.size
        );
        playerScoreLabel.anchor.set(
            this.__labelsConfig.position[this.__player.__side].anchor.x,
            this.__labelsConfig.position[this.__player.__side].anchor.y
        );

        const cpuScoreLabel = this.add.bitmapText(
            this.__labelsConfig.position[this.__cpu.__side].score.x,
            this.__labelsConfig.position[this.__cpu.__side].score.y,
            this.__labelsConfig.font,
            this.__roundScore.cpu.toString(),
            this.__labelsConfig.size
        );
        cpuScoreLabel.anchor.setTo(
            this.__labelsConfig.position[this.__cpu.__side].anchor.x,
            this.__labelsConfig.position[this.__cpu.__side].anchor.y
        );

        this.__labels = {
            name: {
                player: playerNameLabel,
                cpu: cpuNameLabel
            },
            score: {
                player: playerScoreLabel,
                cpu: cpuScoreLabel
            }
        };
    }

    __startRound(): void {
        if (this.__roundStarted) {
            return;
        }
        this.__ball.__launch();
        this.__roundStarted = true;
    }

    __onBallVsPaddle(ball: Ball, paddle: Paddle): void {
        if (ball.__justLaunched) {
            ball.__justLaunched = false;
        }
        if (paddle.__name === 'player') {
            this.__cpu.__active = true;
        } else if (paddle.__name === 'cpu') {
            this.__cpu.__active = false;
        }

        ball.__speed += 10;
        ball.__speed = Math.min(ball.__speed, ball.__MAX_SPEED);
        const ballBody = <Phaser.Physics.Arcade.Body>ball.body;

        let segmentHit = Phaser.Math.clamp(~~(ball.y - paddle.y), -(paddle.__segments.perSection - 1), paddle.__segments.perSection - 1);
        let angle: number;
        let sign = Phaser.Math.sign(segmentHit);
        if (paddle.__side === 'left') {
            angle = segmentHit * paddle.__segments.angle;
        } else {
            angle = 180 - Math.abs(segmentHit * paddle.__segments.angle);
            if (sign !== 0) {
                angle *= sign;
            }
        }
        this.game.physics.arcade.velocityFromAngle(angle, ball.__speed, ballBody.velocity);
    }

    __onBallLost(ball: Ball, tile: Phaser.Tile): void {
        let side = (<Phaser.TilemapLayer>tile.layer).name.replace('Target', '');
        if (this.__player.__side === side) {
            this.__roundScore.cpu++;
            this.__labels.score.cpu.text = this.__roundScore.cpu.toString();
            this.game.camera.flash(0xffffff, 200);
            this.game.camera.shake(0.01, 200);
        } else {
            this.__cpu.__active = false;
            this.__roundScore.player++;
            this.__labels.score.player.text = this.__roundScore.player.toString();
        }
        ball.__reset();
    }

    __watchScore(): void {
        if (this.__gameOver) {
            return;
        }

        if (this.__roundScore.player >= this.__roundScore.target || this.__roundScore.cpu >= this.__roundScore.target) {
            this.__gameOver = true;
            let message: string;
            const gameOverLabel = this.add.bitmapText(this.world.centerX, this.world.centerY, 'AmigaTopazA600', '', 34);
            let tween: Phaser.Tween;
            if (this.__roundScore.player > this.__roundScore.cpu) {
                gameOverLabel.scale.set(0.5, 0.5);
                tween = this.add.tween(gameOverLabel.scale);
                tween.to({x: 1, y: 1}, 800, Phaser.Easing.Bounce.Out);
                message = 'YOU WIN';
            } else {
                gameOverLabel.y = -gameOverLabel.height;
                tween = this.add.tween(gameOverLabel);
                tween.to({y: this.world.centerY}, 800, Phaser.Easing.Bounce.Out);
                message = 'YOU LOOSE';
            }
            gameOverLabel.text = message;
            gameOverLabel.anchor.set(0.5);
            tween.start();
            this.time.events.add(this.__endGameDelay, () => {
                this.game.state.start('Menu');
            });
        }
    }

    __pickPosition(): {side: string, x: number} {
        let position = this.rnd.pick(this.__availableXpositions);
        this.__availableXpositions.splice(this.__availableXpositions.indexOf(position), 1);
        return position;
    }
}

export default Play;