const express = require('express')
const router = express.Router()

const handler = require('../handlers/uploads')

router.post('/upload', handler.uploadFile)

module.exports = router