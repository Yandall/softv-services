const express = require('express')
const router = express.Router()

const personHandler = require("../handler/persons")



router.post('/persons', personHandler.newPerson)
router.get('/persons', personHandler.getAllPersons)
router.put('/persons', personHandler.updatePersons)
router.get('/person/:uuid', personHandler.getPersonByUuid)
router.delete('/person/:uuid', personHandler.deletePersonByUuid)

module.exports = router