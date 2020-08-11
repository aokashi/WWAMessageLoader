module.exports = {
    mode: 'development',
    entry: './src/script.js',
    output: {
        path: __dirname + '/dist',
        filename: 'wwa_message_loader.js'
    },
    devServer: {
        contentBase: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};
