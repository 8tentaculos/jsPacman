import path from 'path';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';

const { NODE_ENV, PORT } = process.env;

export default {
    entry : [
        './src/index'
    ],

    output : {
        path : path.resolve(__dirname, 'dist'),
        filename : 'bundle.js',
    },

    ...(NODE_ENV === 'production' ? {
        mode : 'production'
    } : {
        mode : 'development',
        devtool : 'inline-source-map',
        devServer: {
            host : '0.0.0.0',
            port : PORT || 8080,
            watchOptions : {
                poll : true
            }
        }
    }),

    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /(node_modules|jquery\.gamequery\-0\.7\.1\.js)/,
                use : {
                    loader : 'babel-loader'
                }
            },
            {
                test : /\.css$/,
                use : [ 'style-loader', 'css-loader' ]
            },
            {
                test : /\.(png|svg|jpg|gif)$/,
                loader : 'file-loader' ,
                options : {
                    name : './img/[name].[ext]'
                }
            },
            {
                test : /\.mp3$/,
                loader : 'file-loader',
                options : {
                    name : './audio/[name].[ext]'
                }
            }
        ]
    },

    plugins : [
        new HtmlWebpackPlugin({
            template : './src/index.html'
        })
    ]
};
