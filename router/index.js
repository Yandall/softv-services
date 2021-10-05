const express = require('express')
const router = express.Router()

const handler = require('../handlers/uploads')

router.post('/upload', handler.uploadFile)
router.get('/upload/:name', handler.getFile)

module.exports = router