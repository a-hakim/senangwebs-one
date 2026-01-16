const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

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
    }),
    new MonacoWebpackPlugin({
      // Only include HTML language since that's what this editor uses
      languages: ['html'],
      // Disable features we don't need to reduce bundle size
      features: [
        'bracketMatching',
        'clipboard',
        'colorPicker',
        'comment',
        'contextmenu',
        'find',
        'folding',
        'fontZoom',
        'format',
        'hover',
        'indentation',
        'lineSelection',
        'links',
        'multicursor',
        'smartSelect',
        'snippets',
        'suggest',
        'wordHighlighter',
        'wordOperations',
        'wordPartOperations'
      ]
    })
  ]
};
