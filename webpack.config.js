const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: "source-map",
  entry: './src/assets/scripts/index.js',
	output: {
		filename: 'assets/scripts/index.js',
	},
	devServer: {
		port: 9000,
		watchFiles: ['src/**/*'],
	},
	mode: process.env.NODE_ENV || 'development',
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
				test: /\.css$/,
        use: [
					process.env.NODE_ENV !== 'production'
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
	        {
		        loader: "css-loader",
		        options: {
			        sourceMap: true,
		        },
	        },
					'postcss-loader'
        ],
			},
			{
				test: /\.scss$/,
				use: [
					process.env.NODE_ENV !== 'production'
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
					'postcss-loader',
				],
			},
			{
				test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: 'url-loader?limit=10000',
			},
			{
				test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
				use: 'file-loader',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: 'body',
			scriptLoading: 'defer' // 'blocking'|'defer'|'module'
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/styles/styles.css',
			chunkFilename: '[id].css',
		}),
	],
};
