/* global require, module, __dirname */
const path = require( 'path' );

module.exports = {
    mode : 'production',
    entry : { 'cssanim' : [ '@babel/polyfill', './src/index.js' ] },
    output : {
        filename : '[name].js',
        path : path.resolve( __dirname, 'dist/' ),
    },
    module : {
        rules : [
            {
                test : /\.m?js$/,

                exclude : /node_modules/,
                use : {
                    loader : 'babel-loader',
                    options : { presets : [ '@babel/preset-env' ] }
                }
            }
        ]
    },
    optimization : { minimize : false },
};
