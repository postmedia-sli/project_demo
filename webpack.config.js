const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: "source-map",
  devServer: {
    stats: "errors-only",
    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
    contentBase:'./',
    watchContentBase: true,
    publicPath: '/js/'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.html' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'FrontendModules',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  }
};




