const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dev = process.env.WEBPACK_BUILD_MODE  === 'development' ? true : false;

const config = { 
    entry: { 
        bundle:  path.resolve('src/main.ts'),
        phaser: ['pixi', 'p2', 'phaser']
    }, 
    output: { 
        path: path.resolve('dist'), 
        filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
        publicPath: '' 
    },
    resolve: { 
        extensions: ['.ts', '.js'],
        alias: {
            pixi: path.resolve('node_modules/phaser/build/custom/pixi.js'),
            phaser: path.resolve('node_modules/phaser/build/custom/phaser-split.js'),
            p2: path.resolve('node_modules/phaser/build/custom/p2.js')
        } 
    },
    context: __dirname, 
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                enforce: 'pre', 
                loader: 'tslint-loader' 
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    { 
                        loader: 'cache-loader' 
                    },
                    {
                        loader: 'thread-loader',
                        options: { workers: require('os').cpus().length - 1 }
                    },
                    { 
                        loader: 'ts-loader', 
                        options: { happyPackMode: true }
                    }
                ]
            },
            { test: /pixi\.js$/, use: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, use: 'expose-loader?Phaser' },
            { test: /p2\.js$/, use: 'expose-loader?p2' },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ 
            __IN_DEVELOPMENT__: JSON.stringify(dev),
            __DEFAULT_GAME_WIDTH__: JSON.stringify(640),
            __DEFAULT_GAME_HEIGHT__: JSON.stringify(360),
            __DEFAULT_MIN_GAME_WIDTH__: JSON.stringify(256),
            __DEFAULT_MIN_GAME_HEIGHT__: JSON.stringify(144),
            __DEFAULT_MAX_GAME_WIDTH__: JSON.stringify(1920),
            __DEFAULT_MAX_GAME_HEIGHT__: JSON.stringify(1080),
            __DEFAULT_SCALE_MODE__: /** Phaser.ScaleManager.SHOW_ALL */JSON.stringify(2) 
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'phaser',
            filename: dev ? 'phaser.js' : 'phaser.min.js'
        }),
        new HtmlWebpackPlugin({ 
            template: path.resolve('src/index.html'),
            base: { href: '' },
            title: 'phaser typescript webpack template',
            inject: 'body',
            chunks: ['phaser', 'bundle'],
            chunkSortMode: 'manual',
            minify: {
                minifyCSS: !dev,
                minifyJS: !dev,
                collapseWhitespace: !dev
            }
        }),
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true  }),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{from: path.resolve('assets'), to: path.resolve('dist/assets')}]),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])
    ],
    watch: dev,
    devtool: dev ? 'cheap-module-eval-source-map' : false,
    devServer: {
        hot: true,
        compress: true,
        overlay: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080'
            }
        }
    }
};

if(!dev) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;