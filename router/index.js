const express = require("express");
const router = express.Router();

const workHandler = require("../handler/works");

/*Routing to works in lots*/
router.get("/works", workHandler.getWorks);
router.post("/works", workHandler.newWork);
router.put("/works", workHandler.updateWorks);

/*Routing to a single work */
router.get("/work/:uuid", workHandler.getWork);
router.put("/work/:uuid", workHandler.updateWork);
router.delete("/work/:uuid", workHandler.deleteWork);

module.exports = router;
