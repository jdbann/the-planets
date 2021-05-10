const path = require("path");

module.exports = {
  entry: "./src/the-planets.js",
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  output: {
    filename: "a-planet.js",
    path: path.resolve(__dirname, "dist")
  }
};
