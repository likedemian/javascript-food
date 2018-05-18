const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (env, options) => {
    const config = {
        entry: {
            app: ['./src/app.js']
        },
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(__dirname, 'docs')
        },
        module: {
            rules: [{
                test: /\-tpl.html$/,
                loader: 'handlebars-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer
                            ]
                        }
                    }
                ]
            }, {
                test: /\.scss/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer
                            ]
                        }
                    },
                    'sass-loader'
                ]
            }, {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    name: '[hash].[ext]',
                    limit: 10000
                }
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'food',
                showErrors: true,
                template: './src/index.html',
                filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].[hash].css",
                chunkFilename: "[id].css"
            })
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    }

    if (options.mode === 'development') {
        config.plugins = [...config.plugins, new webpack.HotModuleReplacementPlugin()];

        config.devtool = 'inline-source-map';

        config.devServer = {
            hot: true,
            stats: {
                color: true
            }
        };
    } else {
        config.plugins = [...config.plugins, new CleanWebpackPlugin(['docs']), new UglifyJSPlugin()];
    }

    return config;
}