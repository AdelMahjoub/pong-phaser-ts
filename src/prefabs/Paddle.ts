import Sprite from '../entities/Sprite';

class Paddle extends Sprite {
    public __side: string;
    public __yBoundries: { min: number, max: number };
    public __segments: { angle: number, height: number, total: number, perSection: number};
    constructor(config: IPaddleConfig) {
        super(config);
        this.__side = config.side;
        this.__yBoundries = {
            min: config.yBoundries.min + this.height / 2,
            max: config.yBoundries.max - this.height / 2
        };
        this.__segments = {
            angle: 15,
            height: 0,
            total: 8,
            perSection: 4
        };

        this.__segments.height = ~~(this.height / this.__segments.total);

        (<Phaser.Physics.Arcade.Body>this.body).immovable = true;
    }
}

export default Paddle;