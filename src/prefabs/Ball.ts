import Sprite from '../entities/Sprite';
import Play from '../states/Play';

class Ball extends Sprite {
    public __speed: number;
    public __MAX_SPEED: number;
    public __justLaunched: boolean;
    public __launchAngles: Array<number>;
    public __explosionEmitter: Phaser.Particles.Arcade.Emitter;
    public __resetDelay: number = 1000;
    public __explosionLifespan: number = 800;
    public __explosionParticlesCount: number = 15;
    constructor(config: ISpriteConfig) {
        super(config);
        this.__MAX_SPEED = 300;
        this.__speed = 200;
        this.__justLaunched = false;
        this.__launchAngles = [-45, -30, -15, 0, 15, 30, 45, -135, -150, -165, 180, 165, 150, 135];
        (<Phaser.Physics.Arcade.Body>this.body).bounce.setTo(1);

        this.__explosionEmitter = this.__state.add.emitter(0, 0, this.__explosionParticlesCount);
        this.__explosionEmitter.makeParticles('ball');
        this.__explosionEmitter.setXSpeed(-200, 200);
        this.__explosionEmitter.setYSpeed(-200, 200);
        this.__explosionEmitter.setScale(0.8, 0, 0.8, 0, this.__explosionLifespan);
        this.__explosionEmitter.gravity = 0;

    }

    __launch(): void {
        const body = <Phaser.Physics.Arcade.Body>this.body;
        const randomAngle = this.__state.rnd.pick(this.__launchAngles);
        this.game.physics.arcade.velocityFromAngle(randomAngle, this.__speed, body.velocity);
        this.__justLaunched = true;
    }

    __reset(): void {
        this.__explode();
        this.__state.time.events.add(this.__resetDelay, () => {
            if (!(<Play>this.__state).__gameOver) {
                this.reset(this.__state.world.centerX, this.__state.world.centerY);
                (<Phaser.Physics.Arcade.Body>this.body).velocity.setTo(0);
                (<Play>this.__state).__roundStarted = false;
            } else {
                this.destroy();
            }
        });
    }

    __explode() {
        this.__explosionEmitter.x = this.x;
        this.__explosionEmitter.y = this.y;
        this.kill();
        this.__explosionEmitter.start(true, this.__explosionLifespan, undefined, this.__explosionParticlesCount);
    }

}

export default Ball;