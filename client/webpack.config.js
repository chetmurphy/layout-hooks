const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TSLintPlugin = require('tslint-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "src/index.html"),
  favicon: './src/favicon.ico',
  filename: "./index.html"
});
module.exports = {
  entry: path.join(__dirname, "src/index.tsx"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      /* {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      }, */
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      }
    ]
  },
  plugins: [
    htmlWebpackPlugin,
    // new TSLintPlugin({
    //   files: ['./src/**/*.ts?']
    // })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css"]
  },
  devServer: {
    port: 3000
  }
};