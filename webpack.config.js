const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'SortVisualizer',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'demo'),
      },
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/dist'
      }
    ],
    compress: true,
    port: 9000,
  },
};
