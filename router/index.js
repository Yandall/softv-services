const express = require("express");
const router = express.Router();

const workHandler = require("../handler/works");

router.get("/works", workHandler.getWorks);
router.post("/works", workHandler.newWork);
router.put("/works", workHandler.updateWorks);
router.get("/works/:uuid", workHandler.getWork);
router.put("/work/:uuid", workHandler.updateWork);
router.delete("/work/:uuid", workHandler.deleteWork);

module.exports = router;
