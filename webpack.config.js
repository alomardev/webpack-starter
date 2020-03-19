const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

function src(p = '') {
  return path.join(__dirname, 'src', p);
}
function out(p = '') {
  return path.join(__dirname, 'dist', p);
}


module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isProd = argv.mode === 'production';
  const cleanOutput = argv.clean;

  return {
    entry: [
      src('main.ts'),
      src('style.scss')
    ],

    output: {
      filename: isProd ? 'main.[chunkhash].js': 'main.js',
      path: out(),
    },

    devtool: isDev ? 'source-map' : false,
    devServer: {
      open: true,
      port: 4500,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(sass|scss|css)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDev,
                plugins: [require('autoprefixer')],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss']
    },

    plugins: [
      ...(cleanOutput ? [new CleanWebpackPlugin()] : []),
      new HtmlWebpackPlugin({
        filename: out('index.html'),
        template: src('index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? 'style.[contenthash].css' : 'style.css',
      }),
      new CopyWebpackPlugin([{
        from: src('assets'),
        to: out('assets'),
      }]),
      ...(isProd ? [new WebpackMd5Hash()] : []),
    ],
  };
};
