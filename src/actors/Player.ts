import Paddle from '../prefabs/Paddle';

class Player extends Paddle {
    constructor(config: IPaddleConfig) {
        super(config);
    }

    update(): void {
        this.y = this.__state.input.y;

        if (this.y <= this.__yBoundries.min) {
            this.y = this.__yBoundries.min;
        } else if (this.y >= this.__yBoundries.max) {
            this.y = this.__yBoundries.max;
        }
    }
}

export default Player;