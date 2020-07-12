module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ["bindings", "fsuipc"]
    }
  },
  transpileDependencies: ["vuetify"]
};
