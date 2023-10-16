const path = require('path')
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = (env) => {
    const base = {resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        },
        entry: "./src/index.js",
        output: {
            path: path.join(__dirname, "./bundle"),
            filename: "main-view.js",
            library: 'ResourceTable'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|tsx|ts)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    mode: 'local',
                                    localIdentName: '[name]__[local]--[hash:base64:5]'
                                }
                            }
                        }
                    ],
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser'
            }),
            new webpack.DefinePlugin({
                LOCAL: !!env.local,
                ISSUE: 378083,
                KEY: 360133
            })
        ],
    }
    return {...base}
};



