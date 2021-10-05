const { uuid } = require("uuidv4");
const _db = require("../../services/db");

/** Creates a new work, the params are:
 * @param {Object} req
 * @param {Object} req.body the body of the request must contain the following params
 * @param {string} req.body.id unique id of the new work
 * @param {string} req.body.address the address of the work, does not need an special formating
 * @param {string} req.body.name the name of the work.
 */
const newWork = (req, res) => {
  try {
    let body = req.body;
    if (!body.name || !body.id || !body.address) {
      res.status(400).send({
        success: false,
        message: "Please provide all the needed fields.",
        error: "Field name and type can't be empty.",
      });
      return;
    }
    let data = _db.getData("works");
    let exists = _db.has(data, "id", body.id);
    if (exists) {
      res.status(400).send({
        success: false,
        message: "Can't create this item. Key has to be unique.",
        error: `The id '${body.id}' already exists.`,
      });
      return;
    }
    let newUuid = uuid();
    let newItem = {
      name: body.name,
      id: body.id,
      address: body.address,
    };
    data.set(newUuid, newItem);
    _db.writeDB(data, "works");
    res.status(200).send({
      success: true,
      message: "Work created successfully",
      info: { key: newUuid, ...newItem },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to create new work.",
      error: error.message,
    });
  }
};

/**Returns all the created works */
const getWorks = (req, res) => {
  try {
    let data = _db.getData("works");
    let dataToReturn = Array.from(data);
    res.status(200).send({
      success: true,
      message: "Works found succesfully",
      info: dataToReturn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to get the works.",
      error: error.message,
    });
  }
};

/** Update multiple works, the params are the following:
@param {Object} req
@param {Object[]} req.list array that contains the works to update, each work must be an array
@param {string} req.list[].uuid an uuid that exists
@param {JSON} req.list[].data the new data of each object, this data can not contain the id, this value can not be updated
*/
const updateWorks = (req, res) => {
  try {
    let body = req.body.list;
    for (let item of body) {
      if (item[1].id) {
        res.status(400).send({
          success: false,
          message: "Can't update this work ",
          error: `Can't change the value of the key: 'id'`,
        });
        return;
      }
    }
    let data = _db.getData("works");
    let countUpdated = 0;
    for (let item of body) {
      if (data.has(item[0])) {
        let oldItem = data.get(item[0])[1];
        data.set(item[0], { ...oldItem, ...item[1] });
        countUpdated++;
      }
    }
    _db.writeDB(data, "works");
    res.status(200).send({
      success: true,
      message: "Works updated successfully",
      info: `Number of items updated: ${countUpdated}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to update works.",
      error: error.message,
    });
  }
};
/** Return a single work
 * @param {Object} req 
 * @param {Object} req.params parameteres
 * @param {string} req.params.uuid uuid to search
*/
const getWork = (req, res) => {
  try {
    let uuid = req.params.uuid;
    let data = _db.getData("works");
    let info = data.get(uuid);
    if (info) {
      res.status(200).send({
        success: true,
        message: "Work found succesfully",
        info,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "Work failed to found",
        info: "Work does not exist",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to get the work.",
      error: error.message,
    });
  }
};
/** Update a single work
 * @param {Object} req 
 * @param {Object} req.body values to update, can not contain id
 * @param {Object} req.params parameteres
 * @param {string} req.params.uuid uuid to search
*/
const updateWork = (req, res) => {
  try {
    let body = req.body;
    let uuid = req.params.uuid;
    if (body.id) {
      res.status(400).send({
        success: false,
        message: "Can't update this work ",
        error: `Can't change the value of the key: 'id'`,
      });
      return;
    }
    let data = _db.getData("works");
    let item = req.body;
    let oldItem = data.get(uuid);
    if (oldItem) {
      data.set(uuid, { ...oldItem, ...item });
      _db.writeDB(data, "works");
      res.status(200).send({
        success: true,
        message: "Works updated successfully",
        info: `Item updated ${uuid}`,
      });
    } else {
      res.status(400).send({
        success: true,
        message: "Can not update this item",
        info: `Item ${uuid} does not exist`,
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
/** Delete a single work
 * @param {Object} req 
 * @param {Object} req.params parameteres
 * @param {string} req.params.uuid uuid to delet
*/
const deleteWork = (req, res) => {
  try {
    let uuid = req.params.uuid;
    let data = _db.getData("works");
    let oldItem = data.get(uuid);
    if (oldItem) {
      data.delete(uuid);
      _db.writeDB(data, "works");
      res.status(200).send({
        success: true,
        message: "Work deleted successfully",
        info: `Work deleted ${uuid}`,
      });
    } else {
      res.status(400).send({
        success: true,
        message: "Can not delete this item",
        info: `Work ${uuid} does not exist`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to delete this work.",
      error: error.message,
    });
  }
};

module.exports = {
  newWork,
  getWorks,
  updateWorks,
  getWork,
  updateWork,
  deleteWork,
};