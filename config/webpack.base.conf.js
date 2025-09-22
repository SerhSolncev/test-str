const webpack = require('webpack');
const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "content/",
  scripts: "scripts/",
};

const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs
.readdirSync(PAGES_DIR)
.filter((fileName) => fileName.endsWith(".pug"));

module.exports = {
  mode: isProduction ? "production" : "development",
  target: "web",
  entry: {
    app: path.resolve(PATHS.src, "index.js"),
  },
  output: {
    filename: `${PATHS.scripts}[name].js`,
    path: PATHS.dist,
    clean: true,
    library: "[name]",
    libraryTarget: "umd",
  },
  devtool: isProduction ? false : "source-map",
  externals: {
    paths: PATHS,
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
        options: {
          pretty: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: `${PATHS.assets}fonts/[name][ext]`,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: (pathData) => {
            const relativePath = path
            .relative(path.resolve(__dirname, "../src/content/images"), pathData.filename)
            .replace(/\\/g, "/");
            return `${PATHS.assets}images/${relativePath}`;
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: { sourceMap: true },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "~": PATHS.src,
      vue$: "vue/dist/vue.js",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/${PATHS.assets}images`, to: `${PATHS.assets}images` },
        { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
        { from: `${PATHS.src}/static`, to: "" },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
    ...PAGES.map((page) =>
      new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`,
        minify: false,
        inject: 'body'
      })
    ),
  ],
};
