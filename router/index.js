const express = require('express')
const router = express.Router()

const handler = require('../handlers/uploads')

router.post('/upload', handler.uploadFile)
router.get('/upload/:name', handler.getFile)
router.put('/upload/:name', handler.updateFile)
router.delete('/upload/:name', handler.deleteFile)


module.exports = router