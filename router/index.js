const express = require('express')
const router = express.Router()

const personHandler = require("../handler/persons")
const materialHandler = require("../handler/materials")

router.post('/materials', materialHandler.newMaterial)
router.post('/persons', personHandler.newPerson)
router.get('/persons', personHandler.getAllPersons)
router.put('/persons', personHandler.updatePersons)
router.get('/persons/:uuid', personHandler.getPersonByUuid)


module.exports = router