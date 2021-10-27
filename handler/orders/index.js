const { uuid } = require('uuidv4')
const _db = require("../../services/db")
const moment = require("moment")
const dataName = 'orders'

/**
 * Response with all the data from orders
 * @param {*} req 
 * @param {*} res 
 */
 const getMaterials = (req, res) => {
    try {
        let data = _db.getData(dataName)
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
 * Create a new order.
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.origin Has the origin from the order.
 * @param {string} req.body.destination Has the destination for the order.
 * @param {string} req.body.desc Has a description for the order.
 * @param {object} req.body.items Has the items for the order.
 * @param {string} req.body.estimated Has the estimated date for the order to arrive. Format is YYYY-MM-DD.
 * @param {object} req.body.coords Has the latitude and longitude for where the order is currently located.
 * @param {*} res 
 */
 const newOrder = (req, res) => {
    try{
        let order = req.body
        if (!order.origin || !order.destination || !order.items) {
            res.status(400).send({
                success: false,
                message: "Please provide all the needed fields.", 
                error: "Please provide the next fields: origin, destination, items."
               })
            return
        }
        let data = _db.getData(dataName)
        let newUuid = uuid()
        let newItem = {
            origin: order.origin,
            destination: order.destination,
            desc: order.desc,
            items: order.items,
            estimated: order.estimated,
            hasArrive: false,
            history: [
                {
                    location: order.origin,
                    date: moment().format("YYYY-MM-DD hh:mm"),
                    coords: order.coords,
                    desc: "The order is in origin location."
                }
            ]
        }
        data.set(newUuid, newItem)
        _db.writeDB(data, dataName)
        res.status(200).send({
            success: true,
            message: "Item created successfully.",
            info: {key: newUuid, newItem}
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
 * Create a step in the order, save the step in history of the order.
 * @param {object} req
 * @param {object} req.body
 * @param {string} req.body.location It's the current location of the order.
 * @param {object} req.body.coords Has the latitude and longitude for where the order is currently located.
 * @param {string} req.body.desc Has a small description for the current state of the order.  
 * @param {*} res 
 */
const advanceOrder = (req, res) => {
    try {
        let data = _db.getData(dataName)
        let uuid = req.params.uuid
        let order = data.get(uuid)
        let newStep = req.body
        if (!order) {
            res.status(404).send({
                success: false,
                message: "Couldn't find the order.",
                error: `The order with key '${uuid}' doesn't exists.`
            })
            return
        }
        if (order.hasArrive) {
            res.status(400).send({
                success: false,
                message: "Can't make any progress on this order because that it has already arrived.",
                error: "This order is closed."
            })
            return
        }
        if (!newStep.location) {
            res.status(400).send({
                success: false,
                message: "Please provide all the needed fields.", 
                error: "Please provide the next fields: location."
            })
            return
        }
        newStep.date = moment().format("YYYY-MM-DD hh:mm")
        order.history.push(newStep)
        data.set(uuid, order)
        _db.writeDB(data, dataName)
        res.status(200).send({
            success: true,
            message: "Order updated successfully.",
            info: {key: uuid, order}
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false, 
            message: "There was an error trying to make a step in the order.",
            error: error.message
        })
    }
}


module.exports = { getMaterials, newOrder, advanceOrder }