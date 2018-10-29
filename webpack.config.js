module.exports = {
    mode: 'development',
    entry: './src/script.js',
    output: {
        path: __dirname + '/dist',
        filename: 'script.js'
    },
    devServer: {
        contentBase: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};
