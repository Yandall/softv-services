const express = require('express')
const router = express.Router()

const ordersHandler = require('../handler/orders')

router.get('/orders', ordersHandler.getMaterials)
router.post('/orders', ordersHandler.newOrder)
router.post('/order/:uuid', ordersHandler.advanceOrder)

module.exports = router