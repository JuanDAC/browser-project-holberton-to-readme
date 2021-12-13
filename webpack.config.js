const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('path');
const { JSDOM } = require("jsdom");
const WebpackModules = require('webpack-modules');

const extensions = ['.js', '.mjs'];
const target = ['node'];

/**
 * getStyleDeclaration:: void -> [string]
 */
const getStyleDeclaration = () => Object.keys(Object.getPrototypeOf((new JSDOM()).window.document.body.style));

module.exports = {
    experiments: {
        outputModule: true,
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
        chunkFormat: 'module',
        //libraryTarget: 'umd',
        libraryTarget: 'module',
        // libraryExport: 'default' //<-- New line

    },
    resolve: {
        extensions,
    },
    target,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        comments: false,
                        minified: true,
                        presets: ["@babel/env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    useESModules: true,
                                }
                            ]
                        ],
                    }
                }
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        /*
        new DefinePlugin({
            STYLE_DECLARATIONS: JSON.stringify(getStyleDeclaration()),
        }),
        new WebpackModules(),
        */
    ]
};
