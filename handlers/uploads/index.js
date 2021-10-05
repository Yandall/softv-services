const { uuid } = require("uuidv4");
const fs = require("fs");
const { saveFile } = require("../../services/fileManager");

/** Upload any tipe of file
 * @param {Object} req
 * @param {Object[]} req.files
 * @param {Object} req.files.file
 * @param {string} req.files.file.name
 */
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

/** Get a file by the name and download it
 * @param {Object} req
 * @param {Object} req.params
 * @param {Object} req.params.name
 */
const getFile = (req, res) => {
  let name = req.params.name;
  let path = "./data/files/" + name;
  try {
    fs.readFile(path, function (err, data) {
      if (err) {
        res.status(500).send({Ok: false, message: "The file does not exist"});
      } else {
        var readStream = fs.createReadStream(path);
        readStream.pipe(res);
      }
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};
module.exports = { uploadFile, getFile };
