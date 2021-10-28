const { uuid } = require("uuidv4");
const axios = require("axios");
const _db = require("../../services/db");
const moment = require("moment");
const dataName = "orders";

/**
 * Response with all the data from orders
 * @param {*} req
 * @param {*} res
 */
const getOrders = (req, res) => {
  try {
    let data = _db.getData(dataName);
    data = Array.from(data);
    res.status(200).send({
      success: true,
      message: "Items fetched successfully.",
      info: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to fetch all items.",
      error: error.message,
    });
  }
};

/** Return a single order
 * @param {Object} req
 * @param {Object} req.params parameteres
 * @param {string} req.params.uuid uuid to search
 */
const getOrder = (req, res) => {
  try {
    let uuid = req.params.uuid;
    let data = _db.getData(dataName);
    let info = data.get(uuid);
    if (info) {
      res.status(200).send({
        success: true,
        message: "Order found succesfully",
        info,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Order failed to found",
        info: "Order does not exist",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to get the order.",
      error: error.message,
    });
  }
};

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
  try {
    let order = req.body;
    if (!order.origin || !order.destination || !order.items) {
      res.status(400).send({
        success: false,
        message: "Please provide all the needed fields.",
        error: "Please provide the next fields: origin, destination, items.",
      });
      return;
    }
    let data = _db.getData(dataName);
    let newUuid = uuid();
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
          desc: "The order is in origin location.",
        },
      ],
    };
    data.set(newUuid, newItem);
    _db.writeDB(data, dataName);
    res.status(200).send({
      success: true,
      message: "Item created successfully.",
      info: { key: newUuid, newItem },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to create new item.",
      error: error.message,
    });
  }
};

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
    let data = _db.getData(dataName);
    let uuid = req.params.uuid;
    let order = data.get(uuid);
    let newStep = req.body;
    if (!order) {
      res.status(404).send({
        success: false,
        message: "Couldn't find the order.",
        error: `The order with key '${uuid}' doesn't exists.`,
      });
      return;
    }
    if (order.hasArrive) {
      res.status(400).send({
        success: false,
        message:
          "Can't make any progress on this order because that it has already arrived.",
        error: "This order is closed.",
      });
      return;
    }
    if (!newStep.location) {
      res.status(400).send({
        success: false,
        message: "Please provide all the needed fields.",
        error: "Please provide the next fields: location.",
      });
      return;
    }
    newStep.date = moment().format("YYYY-MM-DD hh:mm");
    order.history.push(newStep);
    data.set(uuid, order);
    _db.writeDB(data, dataName);
    res.status(200).send({
      success: true,
      message: "Order updated successfully.",
      info: { key: uuid, order },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to make a step in the order.",
      error: error.message,
    });
  }
};
/** Update a single order
 * @param {Object} req
 * @param {Object} req.body values to update, can not contain items, estimated, hasArrive or history
 * @param {Object} req.params parameteres
 * @param {string} req.params.uuid uuid to search
 */
const updateOrder = (req, res) => {
  try {
    let body = req.body;
    let uuid = req.params.uuid;
    if (body.items) {
      res.status(400).send({
        success: false,
        message: "Can't update this order ",
        error: `Can't change the value of the items`,
      });
      return;
    }
    if (body.estimated) {
      res.status(400).send({
        success: false,
        message: "Can't update this order ",
        error: `Can't change the value of the estimated`,
      });
      return;
    }
    if (body.hasArrive) {
      res.status(400).send({
        success: false,
        message: "Can't update this order ",
        error: `Can't change the value of the hasArrive`,
      });
      return;
    }
    if (body.history) {
      res.status(400).send({
        success: false,
        message: "Can't update this order ",
        error: `Can't change the value of the history`,
      });
      return;
    }
    let data = _db.getData(dataName);
    let item = req.body;
    let oldItem = data.get(uuid);
    if (oldItem) {
      data.set(uuid, { ...oldItem, ...item });
      _db.writeDB(data, dataName);
      res.status(200).send({
        success: true,
        message: "Order updated successfully",
        info: `Item updated ${uuid}`,
      });
    } else {
      res.status(400).send({
        success: true,
        message: "Can not update this order",
        info: `order ${uuid} does not exist`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to update works.",
      error: error.message,
    });
  }
};
/** Delete a single order
 * @param {Object} req
 * @param {Object} req.params parameteres
 * @param {string} req.params.uuid uuid to delete
 */
const deleteOrder = (req, res) => {
  try {
    let uuid = req.params.uuid;
    let data = _db.getData(dataName);
    let oldItem = data.get(uuid);
    if (oldItem) {
      data.delete(uuid);
      _db.writeDB(data, dataName);
      res.status(200).send({
        success: true,
        message: "Order deleted successfully",
        info: `Order deleted ${uuid}`,
      });
    } else {
      res.status(400).send({
        success: true,
        message: "Can not delete this order",
        info: `Order ${uuid} does not exist`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to delete this order.",
      error: error.message,
    });
  }
};

const getAddress = (req, res) => {
  try {
    let lat = req.params.lat;
    let lon = req.params.lon;
    if (!lat || !lon) {
      res.status(400).send({
        success: true,
        message: "Can not get this addres",
        info: `Lat and lon are required`,
      });
    }
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDbA7CYNUkU4PUX_06ztTCtMF_rML1VNu8`
      )
      .then((response) => {
        res.status(200).send({
          success: true,
          message: "Address succesfully found",
          data: response.data.results[0].formatted_address,
        });
      })
      .catch((error) => {
        res.status(500).send({
            success: false,
            message: "There was an error trying to get the address.",
            error: error.message,
          });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to get the address.",
      error: error.message,
    });
  }
};

module.exports = {
  getOrders,
  newOrder,
  advanceOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getAddress,
};
