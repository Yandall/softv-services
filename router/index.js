const express = require('express')
const router = express.Router()

const handler = require("../handler/materials")

router.post('/materials', handler.newMaterial)

module.exports = router