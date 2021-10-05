const { uuid } = require("uuidv4");
const fs = require("fs");
const { saveFile } = require("../../services/fileManager");

const uploadFile = (req, res) => {
  let newUuid = uuid();
  let ext = req.files.file.name.split(".")[1];
  let name = newUuid + "." + ext;
  let path = req.files.file.path;
  let response = saveFile(name, path);
  res.status(200).send({
    success: true,
    message: "File uploaded",
    error: `The file is called '${response}' `,
  });
};
module.exports = { uploadFile };
