const express = require('express')
const router = express.Router()

const handler = require('../handlers/notification')

router.post('/notification', handler.sendNotification)

module.exports = router