class Preload extends Phaser.State {
    constructor() {
        super();
    }

    preload(): void {
        const preloadSprite: Phaser.Sprite = this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloadSprite');
        const preloadLabel: Phaser.BitmapText = this.add.bitmapText(this.game.width / 2, this.game.height / 2 - 20, 'AmigaTopazA600', 'Loading...', 18);
        preloadSprite.anchor.setTo(0.5);
        preloadLabel.anchor.setTo(0.5);
        this.load.setPreloadSprite(preloadSprite);

        this.load.image('background', 'assets/images/background.png');
        this.load.image('paddle', 'assets/images/paddle.png');
        this.load.image('ball', 'assets/images/ball.png');
        this.load.image('tileset', 'assets/images/tileset.png');
        this.load.tilemap('stage', 'assets/stage.json', null, Phaser.Tilemap.TILED_JSON);
    }

    create(): void {
        this.game.state.start('Menu');
    }
}

export default Preload;