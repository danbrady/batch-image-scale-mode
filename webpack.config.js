const HtmlWebpackInlineSourcePlugin = require("@effortlessmotion/html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const webpack = require("webpack");
const path = require("path");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    ui: "./src/ui.tsx", // The entry point for the UI code
    code: "./src/code.ts", // The entry point for the plugin code
  },
  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      template: "./src/ui.html",
      filename: "ui.html",
      inlineSource: ".(js)$",
      chunks: ["ui"],
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin, [/ui/]),
  ],
});
