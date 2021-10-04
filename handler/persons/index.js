const { uuid } = require("uuidv4");
const _db = require("../../services/db");

const newPerson = (req, res) => {
  try {
    let body = req.body;
    if (!body.name || !body.id || !body.phone || !body.email) {
      res.status(400).send({
        success: false,
        message: "Please provide all the needed fields.",
        error: "Fields name, ID, email or phone can't be empty.",
      });
      return;
    }

    let data = _db.getData("persons");

    let existsID = _db.has(data, "id", body.id);
    if (existsID) {
      res.status(400).send({
        success: false,
        message: "Can't create this item. Key has to be unique.",
        error: `The ID '${body.id}' already exists.`,
      });
      return;
    }

    let existsEmail = _db.has(data, "email", body.email);
    if (existsEmail) {
      res.status(400).send({
        success: false,
        message: "Can't create this item. Key has to be unique.",
        error: `The email '${body.email}' already exists.`,
      });
      return;
    }

    let newUuid = uuid();
    let newItem = {
      name: body.name,
      id: body.id,
      phone: body.phone,
      email: body.email,
    };

    data.set(newUuid, newItem);
    _db.writeDB(data, "persons");
    res.status(200).send({
      success: true,
      message: "Person created successfully",
      info: { key: newUuid, ...newItem },
    });
  } catch (error) {
    console.error(error);
    //console.log(req.body)
    res.status(500).send({
      success: false,
      message: "There was an error trying to create new person.",
      error: error.message,
    });
  }
};

const getAllPersons = (req, res) => {
  try {
    let data = _db.getData("persons");
    let dataToReturn = Array.from(data);
    res.status(200).send({
      success: true,
      message: "Persons found succesfully",
      info: dataToReturn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error trying to get persons.",
      error: error.message,
    });
  }
};

const updatePersons = (req, res) => {
  try {
    let body = req.body.list;
    console.log(req.body);
    for (let item of body) {
      if (item[1].id) {
        res.status(400).send({
          success: false,
          message: "Can't update this person ",
          error: `Can't change the value of the key: 'id'`,
        });
        return;
      }
    }
    let data = _db.getData("persons");
    let countUpdated = 0;
    for (let item of body) {
      if (data.has(item[0])) {
        let oldItem = data.get(item[0]);
        data.set(item[0], { ...oldItem, ...item[1] });
        countUpdated++;
      }
    }
    _db.writeDB(data, "persons");
    res.status(200).send({
      success: true,
      message: "persons updated successfully",
      info: `Number of items updated: ${countUpdated}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to update persons.",
      error: error.message,
    });
  }
};

const getPersonByUuid = (req, res) => {
  try {
    
    let uuid = req.params.uuid;
    let data = _db.getData("persons");
    let info = data.get(uuid)
    res.status(200).send({
        success: true,
        message: "Person found succesfully",
        info,
    });
     
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "There was an error trying to get the person",
      error: error.message,
    });
  }
};

module.exports = { newPerson, getAllPersons, updatePersons, getPersonByUuid };
