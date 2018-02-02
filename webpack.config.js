var path = require('path')

module.exports = {
    context: path.join(__dirname),
    entry: {
        backend: [
            './js/src/backend/componenttype/VideoAdInsertion.jsx'
        ],
        frontend: [
            './js/src/frontend/VideoAdInsertionContent.jsx'
        ],
    },
    output: {
        path: __dirname + "/js/dist/",
        filename: "[name].min.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, 'js/src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
                }
            }
        ]
    },
    externals: {
        'react-backend': "mpat_admin.React",
        'react-frontend' : "mpat_core.React",
        'component-loader-backend' : "mpat_admin.componentAPI",
        'component-loader-frontend' : 'mpat_core.componentAPI',
        'keyBinding' : 'mpat_core.KeyBindingAPI',
        'analytics' : 'mpat_core.analyticsAPI',
        'admin-utils' : 'mpat_admin.utils',
        'core-utils' : 'mpat_core.utils',
        'application' : 'mpat_core.application'
    }
}