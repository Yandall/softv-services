const { uuid } = require('uuidv4')
const _db = require("../../services/db")

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
            message: "Item created successfully",
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

module.exports = { newMaterial }