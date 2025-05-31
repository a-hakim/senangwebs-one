const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    swo: './src/js/swo.js',
    // We will import swo.css into swo.js so webpack processes it
    // styles: './src/css/swo.css' // Remove this line if CSS is imported in JS
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'SWO',
      type: 'umd', // Universal Module Definition
      export: 'default'
    },
    globalObject: 'this', // Important for UMD compatibility
    publicPath: '', // Ensure assets are loaded correctly
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'swo.css' // Output CSS filename
    })
  ]
};