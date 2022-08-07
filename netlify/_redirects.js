const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const fileName =
  process.argv[2] === "--production"
    ? "_redirects.production"
    : "_redirects.development";

fs.readFile(path.join(__dirname, fileName), (err, data) => {
  if (err) {
    return console.log(chalk.bold.red(err.message));
  }

  // * replacing BASE_URL in redirects file
  const newData = data
    .toString()
    .replaceAll("BASE_URL/", process.env.REACT_APP_BASE_URL);

  // * creating a redirect file in build folder
  fs.writeFile(
    path.join(__dirname, "..", "build", "_redirects"),
    newData,
    (err) => {
      if (err) return console.log(chalk.bold.red(err.message));
      console.log(chalk.bold.green("_redirects file created"));
    }
  );
});
