// Generated using webpack-cli https://github.com/webpack/webpack-cli
// eslint-disable-next-line import/no-import-module-exports
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/scripts/index.js',
  devServer: {
    hot: true,
    port: 9000,
    static: './dist',
    watchFiles: ['./src/**/*', './*.html', './*.pug']
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './src/images/256x256.png',
      template: './index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
};
