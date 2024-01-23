// webpack.config.js
const path = require('path');

module.exports = {
    mode: 'development',
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
};
