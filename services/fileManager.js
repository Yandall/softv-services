const fs = require("fs");

const saveFile = (name, path) => {
  fs.readFile(path, function (err, data) {
    var newPath = "./data/files/" + name;
    fs.writeFile(newPath, data, function (err) {
      if (err) throw err;
    });
  });
  return name;
};

module.exports = { saveFile };
