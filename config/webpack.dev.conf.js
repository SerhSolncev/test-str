// webpack.dev.conf.js
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
require("dotenv").config();

// Development config
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    static: {
      directory: baseWebpackConfig.externals.paths.dist,
    },
    port: 8081,
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    hot: true, // Включение горячей перезагрузки
    watchFiles: ['src/**/*.js', 'src/**/*.pug'], // Отслеживаем изменения в JS и Pug
  },

  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
  ],
});

module.exports = new Promise((resolve) => {
  resolve(devWebpackConfig);
});
