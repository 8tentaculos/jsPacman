import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const { NODE_ENV, PORT } = process.env;

export default {
    entry : [
        './src/index'
    ],

    output : {
        path : path.resolve(path.dirname(''), 'dist'),
        filename : 'bundle.js'
    },

    ...(NODE_ENV === 'production' ? {
        mode : 'production'
    } : {
        mode : 'development',
        devtool : 'inline-source-map',
        devServer : {
            host : '0.0.0.0',
            port : PORT || 8080
        }
    }),

    module : {
        rules : [
            {
                test : /\.css$/,
                use : ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: './img/[name][ext]'
                }
            },
            {
                test: /\.(mp3)$/i,
                type: "asset/resource",
                generator: {
                    filename: './audio/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2)$/i,
                type: "asset/resource",
                generator: {
                    filename: './fonts/[name][ext]'
                }
            },
        ]
    },

    plugins : [
        new HtmlWebpackPlugin({
            template : './src/index.html',
            headTags : process.env.JSPACMAN_HEAD_TAGS
        }),
        new CopyWebpackPlugin({
            patterns : [
                {
                    from : path.resolve(path.dirname(''), 'public'),
                    to : path.resolve(path.dirname(''), 'dist')
                }
            ]
        })
    ]
};
