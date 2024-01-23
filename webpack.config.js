// webpack.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/index.js', // Your entry file
    output: {
        filename: 'chatbot-plugin.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'ChatbotPlugin',
            type: 'umd',
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};
