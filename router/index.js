const express = require("express");
const router = express.Router();

const workHandler = require("../handler/works");
const materialsHandler = require("../handler/materials")

/*Routing to works in lots*/
router.get("/works", workHandler.getWorks);
router.post("/works", workHandler.newWork);
router.put("/works", workHandler.updateWorks);


router.get('/materials', materialsHandler.getMaterials)
router.get('/material/:uuid', materialsHandler.getOneMaterial)
router.post('/materials', materialsHandler.newMaterial)
router.put('/materials', materialsHandler.updateMaterials)
router.put('/material/:uuid', materialsHandler.updateOneMaterial)
router.delete('/material/:uuid', materialsHandler.deleteOneMaterial)

/*Routing to a single work */
router.get("/work/:uuid", workHandler.getWork);
router.put("/work/:uuid", workHandler.updateWork);
router.delete("/work/:uuid", workHandler.deleteWork);

module.exports = router;
