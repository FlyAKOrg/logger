module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "import/no-extraneous-dependencies": "off",
    "comma-dangle": "off",
    quotes: ["warn", "double"],
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        mjs: "never",
        vue: "never"
      }
    ]
  }
};
