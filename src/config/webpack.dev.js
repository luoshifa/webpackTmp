const path=require('path');
const glob=require('glob');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const CleanWebpackPlugin=require('clean-webpack-plugin');
const webpack=require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const commonConfig = require('./common')
var webPackConfig={
    mode:"development",
    entry:{},
    output: {
        path: path.resolve(__dirname,'../../dist'),
        filename: '[name].[hash].js'
    },
    resolve:{
        extensions:['.js'],
        alias:{
            'vue$': 'vue/dist/vue.esm.js'
        },
        modules:[path.resolve(__dirname,'../../node_modules')]
    },
    optimization:{
        splitChunks:{
            cacheGroups:{
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2
                },
                style:{
                    name:'style',
                    chunks:'initial',
                    test:/.css$/,
                    priority:10,
                }
            }
        },
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
            },
            {
                test:/\.css$/,
                loaders:['style-loader','css-loader','postcss-loader']
            },
            {
                test:/\.scss$/,
                loaders:['vue-style-loader','style-loader','css-loader','postcss-loader','sass-loader']
            },
            {
                test: /\.js$/,
                loaders:[{
                    loader:'babel-loader',
                    query: {
                        presets: ['env'] //按照最新的ES6语法规则去转换
                    }
                }],
                exclude: /node_modules/,
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                use:[
                    {
                        loader:"file-loader",
                        options:{
                            name:'font/[name].[ext]',
                            publicPath:"../"
                        }
                    }
                ]
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                use:[
                    {
                        loader:'file-loader',
                        options:{
                            name:'img/[name].[ext]',
                            publicPath:"../"
                        }
                    }
                ]
            },
            {
                test: /\.string$/,
                loaders:['html-loader']
            },
            {
                test:/\.html$/,
                loaders:['html-loader']
            }
        ]
    },
    devtool:'#cheap-module-eval-source-map',//eval-source-map
    devServer:{
        contentBase:'./dist',
        port:8081,
        proxy: {
            "/business-admin": {    //需要代理的路径
                target: `${commonConfig.businessDomain}/`,  //需要代理的域名
                changeOrigin: true  //必须配置为true，才能正确代理
            }
        }
    },
    performance: {
        hints: false
    },
    plugins:[
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
    ]
}

function getEntries(globPath) {
    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function(filepath) {
        var split = filepath.split('/');
        var name = split[split.length - 2];

        entries[name] = './' + filepath;
    });

    return entries;
}
var entries = getEntries('src/views/**/index.js');
Object.keys(entries).forEach(function(name) {
    webPackConfig.entry[name] = entries[name];
    var plugin = new HtmlWebpackPlugin({
        filename: name + '.html',
        template: path.join('./src/views/' + name + '/index.html'),
        inject: true,
        chunks: ['style','commons',name],
        chunksSortMode:"dependency",
    });
    webPackConfig.plugins.push(plugin);
})

module.exports=webPackConfig;