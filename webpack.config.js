const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    swo: './src/js/swo.js',
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
    publicPath: 'auto', // Let webpack determine the public path at runtime
  },
  // Disable code splitting to bundle everything into a single file
  optimization: {
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
        type: 'asset/inline' // Inline fonts as base64 to avoid separate file requests
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'swo.css' 
    })
  ]
};
