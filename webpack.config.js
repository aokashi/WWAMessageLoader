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
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        name: 'wwa_message_loader.worker.js'
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};
