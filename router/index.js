const express = require('express')
const router = express.Router()

const materialsHandler = require("../handler/materials")

router.get('/materials', materialsHandler.getMaterials)
router.get('/material/:uuid', materialsHandler.getOneMaterial)
router.post('/materials', materialsHandler.newMaterial)
router.put('/materials', materialsHandler.updateMaterials)


module.exports = router