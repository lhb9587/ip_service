module.exports = {
  presets: [
    ["@vue/app",
      {
        useBuiltIns:'entry',
        jsx:true}],
    // ['@vue/babel-preset-jsx'],
  ],
  "env": {
    "development": {
      "plugins": ["dynamic-import-node",]
    }
  },
  "plugins": ["@babel/plugin-transform-strict-mode"]
};
