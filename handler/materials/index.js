const { uuid } = require('uuidv4')
const _db = require("../../services/db")


/**
 * Response with all the data from materials
 * @param {*} req 
 * @param {*} res 
 */
const getMaterials = (req, res) => {
    try {
        let data = _db.getData("materials")
        data = Array.from(data)
        res.status(200).send({
            success: true,
            message: "Items fetched successfully.",
            info: data
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false, 
            message: "There was an error trying to fetch all items.",
            error: error.message
        })
    }
}

/**
 * Create a new material.
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.name Contains the name for the new material. It has to be unique.
 * @param {string} req.body.type Has the type for the new material.
 * @param {number} req.body.cant It's the amount for the new material. Default is 1.
 * @param {*} res 
 */
const newMaterial = (req, res) => {
    try{
        let body = req.body
        if (!body.name || !body.type) {
            res.status(400).send({
                success: false, 
                message: "Please provide all the needed fields.", 
                error: "Field name and type can't be empty."
               })
            return
        }
        let data = _db.getData('materials')
        let exists = _db.has(data, 'name', body.name)
        if (exists) {
            res.status(400).send({
                success: false,
                message: "Can't create this item. Key has to be unique.",
                error: `The name '${body.name}' already exists.`
            })
            return
        }
        let newUuid = uuid()
        let newItem = {
           name: body.name,
           type: body.type,
           cant: body.cant || 1
       }
        data.set(newUuid, newItem)
        _db.writeDB(data, 'materials')
        res.status(200).send({
            success: true,
            message: "Item created successfully.",
            info: {key: newUuid, ...newItem}
        })
    }
    catch(error) {
        console.error(error)
        res.status(500).send({
            success: false, 
            message: "There was an error trying to create new item.",
            error: error.message
        })
    }
}

/**
 * Updates 1 or more materials at the same time.
 * @param {object} req 
 * @param {object} req.body
 * @param {Array} req.body.list It's a list with all the items to be updated. 
 * The first index is the key and the second it's an object with the values
 * @param {*} res 
 * @returns 
 */
const updateMaterials = (req, res) => {
    try {
        let body = req.body.list
        for (let item of body) {
            if (item[1].name) {
                res.status(400).send({
                    success: false,
                    message: "Can't update this item.",
                    error: `Can't change the value of the key: 'name'.`
                })
                return
            }
        }
        let data = _db.getData('materials')
        let countUpdated = 0
        for (let item of body) {
            if (data.has(item[0])) {
                let oldItem = data.get(item[0])
                data.set(item[0], {...oldItem, ...item[1]})
                countUpdated++
            }
        }
        _db.writeDB(data, 'materials')
        res.status(200).send({
            success: true,
            message: "Items updated successfully.",
            info: `Number of items updated: ${countUpdated}.`
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false,
            message: "There was an error trying to update items.",
            error: error.message
        })
    }
}


/**
 * Response with the value for the key provided in the params
 * @param {*} req 
 * @param {*} res 
 */
const getOneMaterial = (req, res) => {
    try {
        let uuid = req.params.uuid
        let data = _db.getData("materials")
        let value = data.get(uuid)
        res.status(200).send({
            success: true,
            message: "Item fetch successfully.",
            info: value
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false,
            message: "There was an error trying to get item.",
            error: error.message
        })
    }
}

/**
 * Update one material with the key provided in the
 * @param {object} req
 * @param {object} req.body
 * @param {string} req.body.type Has the type to update.
 * @param {number} req.body.cant It's the amount to update.
 * @param {*} res 
 */
const updateOneMaterial = (req, res) => {
    try {
        let body = req.body
        if (body.name) {
            res.status(400).send({
                success: false,
                message: "Can't update this item",
                error: `Can't change the value of the key: 'name'.`
            })
            return
        }
        let uuid = req.params.uuid
        let data = _db.getData('materials')
        let oldValue = data.get(uuid)
        let newItem = {...oldValue, ...body}
        data.set(uuid, newItem)
        console.log(data.get(uuid))
        _db.writeDB(data, 'materials')
        res.status(200).send({
            success: true,
            message: "Item updated successfully.",
            info: newItem
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false,
            message: "There was an error trying to update item.",
            error: error.message
        })
    }
}

/**
 * Delete one material with the key provided in the params.
 * @param {*} req 
 * @param {*} res 
 */
const deleteOneMaterial = (req, res) => {
    try{
        let uuid = req.params.uuid
        let data = _db.getData('materials')
        data.delete(uuid)
        _db.writeDB(data, 'materials')
        res.status(200).send({
            success: true,
            message: "Item deleted successfully.",
            info: {}
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false,
            message: "There was an error trying to delete item.",
            error: error.message
        })
    }
}

module.exports = { getMaterials, getOneMaterial, newMaterial, updateMaterials, updateOneMaterial, deleteOneMaterial }