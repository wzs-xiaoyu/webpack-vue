module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:vue/essential", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6,
    sourceType: "module"
  },
  plugins: ["vue"],
  rules: {
    "no-console": 0, //禁止使用console
    eqeqeq: 0, //必须使用全等
    "no-debugger": 1, //禁止使用debugger
    "no-unused-vars": [1, { vars: "all", args: "after-used" }] //不能有声明后未被使用的变量或参数
  }
};
