const express = require('express')
const router = express.Router()

const ordersHandler = require('../handler/orders')

router.get('/orders', ordersHandler.getOrders)
router.get('/order/:uuid', ordersHandler.getOrder)
router.post('/orders', ordersHandler.newOrder)
router.post('/order/:uuid', ordersHandler.advanceOrder)
router.put('/order/:uuid', ordersHandler.updateOrder)
router.delete('/order/:uuid', ordersHandler.deleteOrder)

module.exports = router