const express = require('express')
const router = express.Router()

const workHandler = require("../handler/works")

router.get('/works', workHandler.getAllWorks)
router.post('/works', workHandler.newWork)
router.put('/works', workHandler.updateWorks)

module.exports = router