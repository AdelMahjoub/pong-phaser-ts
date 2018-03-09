import Paddle from '../prefabs/Paddle';
import Play from '../states/Play';

class Cpu extends Paddle {
    public __ANGLE_TO_MOVE_UP: number;
    public __ANGLE_TO_MOVE_DOWN: number;
    public __REFLEX: number;
    public __RELAX: number;
    public __active: boolean;
    constructor(config: IPaddleConfig) {
        super(config);
        this.__ANGLE_TO_MOVE_DOWN = 90;
        this.__ANGLE_TO_MOVE_UP = -90;
        this.__REFLEX = 110;
        this.__RELAX = 1000;
        this.__active = false;
        (<Phaser.Physics.Arcade.Body>this.body).stopVelocityOnCollide = false;
    }

    update(): void {
        if ((<Play>this.__state).__ball.__justLaunched) {
            (<Play>this.__state).__ball.__justLaunched = false;
            let ballBody = <Phaser.Physics.Arcade.Body>(<Play>this.__state).__ball.body;
            if ((ballBody.velocity.x > 0 && this.__side === 'right') || (ballBody.velocity.x < 0 && this.__side === 'left')) {
                this.__active = true;
            }
        }
        if (this.__active) {
            let ballY = (<Play>this.__state).__ball.y;
            let distance = this.game.physics.arcade.distanceToXY(this, this.x, ballY);
            let angle = ballY > this.y ? this.__ANGLE_TO_MOVE_DOWN : this.__ANGLE_TO_MOVE_UP;
            (<Phaser.Physics.Arcade.Body>this.body).moveTo(this.__REFLEX, distance, angle);
        } else {
            let y = (<Play>this.__state).__paddlePositions.yPosition;
            let distance = this.game.physics.arcade.distanceToXY(this, this.x, y);
            let angle = y > this.y ? this.__ANGLE_TO_MOVE_DOWN : this.__ANGLE_TO_MOVE_UP;
            (<Phaser.Physics.Arcade.Body>this.body).moveTo(this.__RELAX, distance, angle);
        }
    }
}

export default Cpu;