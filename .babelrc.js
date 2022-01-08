const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current",
      },
    },
  ],
  ["@babel/preset-react"],
];

const plugins = [
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-transform-runtime",
  "css-modules-transform",
  [
    "babel-plugin-react-css-modules",
    {
      webpackHotModuleReloading: true,
      autoResolveMultipleImports: true,
    },
  ],
];

if (process.env.COMPILER_ENV === "server") {
  plugins.push(
    [
      "file-loader",
      {
        name: "[hash].[ext]",
        extensions: ["png", "jpg", "jpeg", "gif", "svg"],
        publicPath: "/public/img",
        outputPath: null,
      },
      "img-file-loader-plugin",
    ],
    
  );
}

const addConfigs = { ignore: ["./src/static/"] };

module.exports = { plugins, presets, ...addConfigs };
