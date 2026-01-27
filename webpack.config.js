const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      swo: './src/js/swo.js',
      'swo.min': './src/js/swo.js', // Separate entry for minified version
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'SWO',
        type: 'umd', 
        export: 'default'
      },
      globalObject: 'this', 
      publicPath: 'auto', 
      clean: true, // Clean the output directory before emit
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map', // Enable source maps
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /\.min\.js$/, // Only minify files ending in .min.js
        }),
        new CssMinimizerPlugin({
          include: /\.min\.css$/, // Only minify files ending in .min.css
        }),
      ],
      splitChunks: false,
      runtimeChunk: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.ttf$/,
          type: 'asset/inline' 
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: ({ chunk }) => {
          return `${chunk.name}.css`;
        },
      })
    ]
  };
};
