const { uuid } = require("uuidv4");
const _db = require("../../services/db");

/**
 * Create multiple dates into the map in JSON format 
 * one record can not have the same date, hour and idPerson at the same time
 * @param {Object} req Receives all the data for the new date 
 * @param {Object} req.body
 * @param {String} req.body.date Contains the day-month-year of the date in string format
 * @param {String} req.body.hour Contains the hour of the date
 * @param {String} req.body.description contains a text explaining the subject of the date
 * @param {String} req.body.address Contains the place where the date will be made
 * @param {String} req.body.idPerson Has the id of the person who will assit to the date
 * @param {String} req.body.nameAttendant The name of who attend the date
 * @param {*} res 
 * 
 */
const newDates = (req, res) => {
  try {
    let body = req.body;
    if (!body.date || !body.hour || !body.description || !body.address || !body.idPerson || !body.nameAttendant) {
      res.status(400).send({
        success: false,
        message: "Please provide all the needed fields.",
        error: "Fields date, hour, description, address, id's person or name of attendant can't be empty.",
      });
      return;
    }

    let data = _db.getData("dates");

    let exists = (_db.has(data, "date", body.date) && _db.has(data, "hour", body.hour) && 
        _db.has(data, "idPerson", body.idPerson) );
    if (exists) {
      res.status(400).send({
        success: false,
        message: "Can't create this item. Key has to be unique.",
        error: `The date  already exists.`,
      });
      return;
    }

    
    let newUuid = uuid();
    let newDate = {
      date: body.date,
      hour: body.hour,
      description: body.description,
      address: body.address,
      idPerson: body.idPerson,
      nameAttendant: body.nameAttendant
    };

    data.set(newUuid, newDate);
    _db.writeDB(data, "dates");
    res.status(200).send({
      success: true,
      message: "Person created successfully",
      info: { key: newUuid, ...newDate },
    });
  } catch (error) {
    console.error(error);
    //console.log(req.body)
    res.status(500).send({
      success: false,
      message: "There was an error trying to create new date.",
      error: error.message,
    });
  }
};

/**
 * get all dates from de map
 * @param {*} req 
 * @param {*} res 
 */
const getAllDates = (req, res) => {
  try {
    let data = _db.getData("dates");
    let dataToReturn = Array.from(data);
    res.status(200).send({
      success: true,
      message: "Dates found succesfully",
      info: dataToReturn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error trying to get dates.",
      error: error.message,
    });
  }
};


/**
 * update multiple dates into  dates map, the object must include the uuid to update correctly
 * @param {*} req 
 * @param {*} res 
 */
const updateDates = (req, res) => {
  try {
    let body = req.body.list;
    console.log(req.body);
    let data = _db.getData("dates");
    let countUpdated = 0;
    for (let item of body) {
      if (data.has(item[0])) {
        let oldItem = data.get(item[0]);
        data.set(item[0], { ...oldItem, ...item[1] });
        countUpdated++;
      }
    }
    _db.writeDB(data, "dates");
    res.status(200).send({
      success: true,
      message: "dates updated successfully",
      info: `Number of items updated: ${countUpdated}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to update dates.",
      error: error.message,
    });
  }
};



module.exports = { newDates, getAllDates, updateDates};
