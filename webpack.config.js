const path=require('path');
const glob=require('glob');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const CleanWebpackPlugin=require('clean-webpack-plugin');
const webpack=require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HappyPack = require('happypack');
const CompressionPlugin = require("compression-webpack-plugin")
const commonConfig = require('./src/config/common')
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
var webPackConfig={
    entry:{
        index:'./src/index.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].[hash].js'
    },
    resolve:{
        extensions:['.js'],
        alias:{
            'vue$': 'vue/dist/vue.esm.js'
        },
        modules:[path.resolve(__dirname,'node_modules')]
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
                loader:'happypack/loader?id=vue',
            },
            {
                test:/\.css$/,
                use:['happypack/loader?id=css']
            },
            {
                test:/\.scss$/,
                use:['happypack/loader?id=scss']
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=js',
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
                use:['happypack/loader?id=html']
            },
            {
                test:/\.html$/,
                use:['happypack/loader?id=html']
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
                // target: "https://img-test.homy.cc/",  //需要代理的域名
                // target: "http://xcx-manage.homy.cc/",  //需要代理的域名
                changeOrigin: true  //必须配置为true，才能正确代理
            }
        }
    },
    performance: {
        hints: false
    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            testText: JSON.stringify('production')
        }),
        new HappyPack({
            id:'css',
            threadPool: happyThreadPool,
            cache: true,
            loaders:['style-loader','css-loader','postcss-loader']
        }),
        new HappyPack({
            id:'scss',
            threadPool: happyThreadPool,
            cache: true,
            loaders:['style-loader','css-loader','postcss-loader','sass-loader']
        }),
        new HappyPack({
            id:'html',
            threadPool: happyThreadPool,
            cache: true,
            loaders:['html-loader']
        }),
        new HappyPack({
            id:'vue',
            threadPool: happyThreadPool,
            cache: true,
            loaders:[{
                loader:'vue-loader',
                options:{
                    loaders:{
                        'scss': 'vue-style-loader!css-loader!postcss-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax'
                    }
                }
            }]
        }),
        new HappyPack({
            id:'js',
            threadPool: happyThreadPool,
            cache: true,
            loaders:[{
                loader:'babel-loader',
                query: {
                    presets: ['env'] //按照最新的ES6语法规则去转换
                }
            }]
        })
    ]
}
if(process.env.NODE_ENV == 'production')
{
    webPackConfig.devtool="cheap-module-source-map";
    webPackConfig.plugins.push(new ParallelUglifyPlugin({
        sourceMap: true
    }));
    webPackConfig.plugins.push(new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
    }));
}else {
    console.log('development')
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
        minify:{
            removeComments:true,
            collapseWhitespace:true
        }
    });
    webPackConfig.plugins.push(plugin);
})

module.exports=webPackConfig;