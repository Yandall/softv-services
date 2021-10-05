const express = require("express");
const router = express.Router();

const workHandler = require("../handler/works");
const materialsHandler = require("../handler/materials")
const personHandler = require("../handler/persons")
const datesHandler = require("../handler/dates")

/*Routing to works in lots*/
router.get("/works", workHandler.getWorks);
router.post("/works", workHandler.newWork);
router.put("/works", workHandler.updateWorks);
/*Routing to a single work */
router.get("/work/:uuid", workHandler.getWork);
router.put("/work/:uuid", workHandler.updateWork);
router.delete("/work/:uuid", workHandler.deleteWork);

/*Routing dates */
router.post('/dates', datesHandler.newDates)
router.get('/dates', datesHandler.getAllDates)
router.put('/dates', datesHandler.updateDates)

/*Routing persons*/
router.post('/persons', personHandler.newPerson)
router.get('/persons', personHandler.getAllPersons)
router.put('/persons', personHandler.updatePersons)
router.get('/person/:uuid', personHandler.getPersonByUuid)
router.delete('/person/:uuid', personHandler.deletePersonByUuid)


/*Routing materials*/
router.get('/materials', materialsHandler.getMaterials)
router.get('/material/:uuid', materialsHandler.getOneMaterial)
router.post('/materials', materialsHandler.newMaterial)
router.put('/materials', materialsHandler.updateMaterials)
router.put('/material/:uuid', materialsHandler.updateOneMaterial)
router.delete('/material/:uuid', materialsHandler.deleteOneMaterial)



module.exports = router;
