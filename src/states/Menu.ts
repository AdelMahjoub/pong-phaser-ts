class Title extends Phaser.State {
    constructor(
        public __title: Phaser.BitmapText,
        public __startMsg: Phaser.BitmapText,
        public __titleTween: Phaser.Tween,
        public __startMessageTween: Phaser.Tween
    ) {
        super();
    }

    create() {
        const title = 'Pong Clone';
        this.__title = this.add.bitmapText(this.game.width / 2, -100, 'AmigaTopazA600', title, 40);
        this.__title.anchor.setTo(0.5);

        const startMsg = this.game.device.desktop ? 'Click to start' : 'Touch to start';
        this.__startMsg = this.add.bitmapText(this.game.width / 2, this.game.height / 2, 'AmigaTopazA600', startMsg, 20);
        this.__startMsg.anchor.setTo(0.5);

        this.__titleTween = this.add.tween(this.__title).to({y: this.game.height / 2 - 80}, 1000, 'Bounce.easeOut', true);
        this.__startMessageTween = this.add.tween(this.__startMsg).to({alpha: 0}, 600, 'Linear', true, 0, -1, true);

        this.input.onUp.add(this.__start, this);
    }

    __start() {
        this.game.state.start('Play');
    }
}

export default Title;