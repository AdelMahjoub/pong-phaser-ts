/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts"/>
/// <reference path="./globals.d.ts"/>

import Boot from './states/Boot';
import Preload from './states/Preload';
import Menu from './states/Menu';
import Play from './states/Play';

class App extends Phaser.Game {
    constructor(config: IGameConfig) {
        super(config.width, config.height, config.renderer);
        this.state.add('Boot', Boot);
        this.state.add('Preload', Preload);
        this.state.add('Menu', Menu);
        this.state.add('Play', Play);
    }

    /**
     * @param {*} params Additional parameters that will be passed to the State.init function (if it has one)
     * @memberof App
     */
    run (params?: any) {
        this.state.start('Boot', true, false, params);
    }
}

window.addEventListener('load', function() {

    const config: IGameConfig = {
        width: __DEFAULT_GAME_WIDTH__,
        height: __DEFAULT_GAME_HEIGHT__,
        renderer: Phaser.AUTO
    };

    const app = new App(config);

    app.run();
});