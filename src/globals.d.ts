declare const __IN_DEVELOPMENT__          : boolean;
declare const __DEFAULT_GAME_WIDTH__      : number;
declare const __DEFAULT_GAME_HEIGHT__     : number;
declare const __DEFAULT_MIN_GAME_WIDTH__  : number;
declare const __DEFAULT_MIN_GAME_HEIGHT__ : number;
declare const __DEFAULT_MAX_GAME_WIDTH__  : number;
declare const __DEFAULT_MAX_GAME_HEIGHT__ : number;
declare const __DEFAULT_SCALE_MODE__      : number; 

interface IGameConfig {
    width: number;
    height: number;
    renderer: number;
    parent?: string|HTMLElement;
    state?: Phaser.State;
    transparent?: boolean;
    antialias?: boolean;
    [key:string]: any;
}

interface IGameMinMaxDimensions {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    [key:string]: number;
}

interface ISpriteConfig {
    state: Phaser.State;
    game: Phaser.Game;
    name: string;
    x: number;
    y: number;
    texture: string;
    [key: string]: any;
}

interface IPaddleConfig extends ISpriteConfig {
    side: string;
    yBoundries: {min: number, max: number};
    [key: string]: any;
}