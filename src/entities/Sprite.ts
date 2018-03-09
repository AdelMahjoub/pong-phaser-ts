class Sprite extends Phaser.Sprite {
    public __state: Phaser.State;
    public __name: string;
    constructor(config: ISpriteConfig) {
        super(config.game, config.x, config.y, config.texture);
        this.__state = config.state;
        this.__name = config.name;
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this);
    }
}

export default Sprite;