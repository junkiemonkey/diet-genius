const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const pages = ['index', 'quiz'];

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendors',
          enforce: true
        }
      }
    }
  },
  module: {
    rules:  [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$|njk/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              attributes: {
                root: path.resolve(__dirname, 'src/images/')
              }
            }
          },
          {
            loader: 'nunjucks-html-loader',
            options : {
              searchPaths: ['./src/views'],
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[contenthash]',
          outputPath: 'assets/images',
          publicPath: 'assets/images'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[contenthash]',
          outputPath: '/assets/fonts',
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ...pages.map(page => (
      new HtmlWebpackPlugin({
        filename: `${page}.html`,
        inject: 'body',
        hash: true,
        minify: false,
        template: `nunjucks-html-loader!./src/views/${page}.njk`,
      })
    )),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      // jQuery: 'jquery',
      // Util: 'exports-loader?Util!bootstrap/js/dist/util'
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
      chunkFilename: "css/[name].css"
    })
  ]
}
