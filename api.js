const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const formData = require('express-form-data');


const app = express();

app.use(formData.parse());
app.use(cors());
app.use(express.json());
app.use("/api", require("./router"));

const port = 8083;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
