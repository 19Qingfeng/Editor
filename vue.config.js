module.exports = {
  // transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map"
  },
  productionSourceMap: process.env.NODE_ENV !== "production",
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  chainWebpack: config => {
    const oneOfsMap = config.module.rule("scss").oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          // 引入一个全局sass文件
          resources: "./src/style/var.scss"

          // // 引入多个全局sass文件
          // resources: [
          //   "./src/assets/styles/vars.scss",
          //   "./src/assets/styles/mixins.scss",
          //   "./src/assets/styles/functions.scss",
          // ],
        })
        .end();
    });
  }
};
