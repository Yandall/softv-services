const nodemailer = require("nodemailer");

const uploadFile = (req, res) => {

    try{fs.readFile(req.files.image.path, function (err, data) {
        var fileName = req.files.file.name;
        /// If there's an error
        if (!fileName) {
          res.status(400).send({
              success: true,
              message: 'Your file dont contain a name'
          })
        } else {
          var newPath = __dirname + "/uploads/fullsize/" + fileName;
          fs.writeFile(newPath, data, function (err) {
            res.redirect("/uploads/fullsize/" + fileName);
          });
    
          res.status(200).send({
              success: false,
              message: "File uploaded succesfully",
          })
        }
      });}catch(e){
        res.status(500).send({
            success: false,
            message: "Error while uploading file",
        })
      }
  
};

module.exports = {uploadFile};
