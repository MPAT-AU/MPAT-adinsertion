var webpack = require('webpack');
var path = require('path');
var debug = process.env.NODE_ENV !== 'production';


const DebugDefines = {
    'DEBUG': 'true'
};

const ProductionDefines = {
    'process.env': {
        'NODE_ENV': '"production"'
    },
    'DEBUG': 'false'
};

module.exports = {
    context: path.join(__dirname),
    entry: {
        interface: [
            'babel-polyfill',
            './js/src/backend/admininterface/adminInterface.js'
        ],
        backend: [
            './js/src/backend/componenttype/VideoAdInsertion.jsx',
        ],
        frontend: [
            './js/src/frontend/VideoAdInsertionContent.jsx',
        ],
    },
    devtool: debug ? "inline-sourcemap" : null,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.join(__dirname, "js/src"),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: [
                        'react-html-attrs',
                        'transform-class-properties',
                        'transform-decorators-legacy',
                        'transform-async-to-generator'],
                }
            }
        ]
    },
    output: {
        path: __dirname + "/js/dist/",
        filename: "[name].min.js"
    },
    externals: {
        'react-backend': "mpat_admin.React",
        'react-frontend' : "mpat_core.React",
        'component-loader-backend' : "mpat_admin.componentAPI",
        'component-loader-frontend' : 'mpat_core.componentAPI'
    },
    plugins: debug ? [
        new webpack.DefinePlugin(DebugDefines)
    ] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        //Make Uglify JS remove all the React debug messages
        new webpack.DefinePlugin(ProductionDefines),
        //see https://github.com/mishoo/UglifyJS2 for the parameter meanings
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:false,
                drop_console: true
            },
        }),
    ]
};