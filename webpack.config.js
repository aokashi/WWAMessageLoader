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
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};
