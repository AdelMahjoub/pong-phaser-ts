class Boot extends Phaser.State {

    /**
     * Image to display if the device is in an incorrect orientation
     * @type {Phaser.Image}
     * @memberof Boot
     */
    __screenOrientationMessage: Phaser.Image|null = null;

    /**
     * `GAME SIZE | VIEW PORT` min, max dimensions
     * @type {IGameMinMaxDimensions}
     * @memberof Boot
     */
    __minMaxDimensions: IGameMinMaxDimensions = {
        minWidth: __DEFAULT_MIN_GAME_WIDTH__,
        minHeight: __DEFAULT_MIN_GAME_HEIGHT__,
        maxWidth: __DEFAULT_MAX_GAME_WIDTH__,
        maxHeight: __DEFAULT_MAX_GAME_HEIGHT__
    };

    constructor() {
        super();
    }

    init(): void {
        this.__setScreenScalingStrategy();
        this.__handleScreenOrientation();
        this.game.renderer.renderSession.roundPixels = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    preload(): void {
        this.load.bitmapFont('AmigaTopazA600', 'assets/fonts/AmigaTopazA600.png', 'assets/fonts/AmigaTopazA600.xml');
        this.load.image('ForceLandscape', 'assets/images/ForceLandscape.png');
        this.load.image('ForcePortrait', 'assets/images/ForcePortrait.png');
        this.load.image('preloadSprite', 'assets/images/preloadSprite.png');
    }

    create(): void {
        this.stage.backgroundColor = '#004358';
        this.game.state.start('Preload');
    }

    __setScreenScalingStrategy(): void {
        this.scale.scaleMode = __DEFAULT_SCALE_MODE__;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setMinMax(
            this.__minMaxDimensions.minWidth, this.__minMaxDimensions.minHeight,
            this.__minMaxDimensions.maxWidth, this.__minMaxDimensions.maxHeight
        );
    }

    __handleScreenOrientation(): void {
        if (this.game.device.desktop) {
            return;
        }
        this.scale.forceOrientation(this.game.scale.isGameLandscape, this.game.scale.isGamePortrait);
        this.scale.enterIncorrectOrientation.add(this.__onIncorrectScreenOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.__onIncorrectScreenOrientation, this);
    }

    __onIncorrectScreenOrientation(): void {
        if (this.scale.incorrectOrientation) {
            if (!this.__screenOrientationMessage) {
                let image: string|null = null;
                if (this.scale.forceLandscape && !this.scale.isLandscape && this.scale.isGameLandscape) {
                    image = 'ForceLandscape';
                } else if (this.scale.forcePortrait && !this.scale.isPortrait && this.scale.isGamePortrait) {
                    image = 'ForcePortrait';
                }
                if (!image) {
                    return;
                }
                this.__screenOrientationMessage = this.game.make.image(0, 0, image);
            }
            this.__screenOrientationMessage.scale.setTo(this.scale.sourceAspectRatio, 1 / this.scale.sourceAspectRatio);
            this.stage.addChild(this.__screenOrientationMessage);
            this.game.paused = true;
        } else {
            this.game.paused = false;
            if (this.__screenOrientationMessage) {
                this.stage.removeChild(this.__screenOrientationMessage);
            }
        }
    }
}

export default Boot;