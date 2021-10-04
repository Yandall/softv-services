const express = require('express')
const router = express.Router()

const datesHandler = require("../handler/dates")

router.post('/dates', datesHandler.newDates)
router.get('/dates', datesHandler.getAllDates)

module.exports = router