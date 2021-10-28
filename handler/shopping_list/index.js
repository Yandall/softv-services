const { uuid } = require("uuidv4");
const _db = require("../../services/db");



const newShoppingList = (req, res) => {

    try {
        let body = req.body;

        if (!body.listItems, !body.date, !body.nameBuyer, !body.nameSupplier) {
            res.status(400).send({
                success: false,
                message: 'Please provide all fields needed',
                error: 'Fields items, date, name of buyer or supplier cannot be empty'
            });
            return;    
        }

        let data = _db.getData('shopping_list');
        let newUuid = uuid();
        let newShoppingList = {
            shoppingList: body.listItems,
            date: body.date,
            nameBuyer: body.nameBuyer,
            nameSupplier: body.nameSupplier
        };

        data.set(newUuid, newShoppingList);
        _db.writeDB(data, "shopping_list");
        res.status(200).send({
            success: true,
            message: "Shopping list created successfully",
            info: { key: newUuid, ...newShoppingList}
        });
 
    } catch (error) {

        console.error(error);
        res.status(500).send({
            success: false,
            message: "There was an error creating the shopping list",
            error: error.message
        });
        
    }
};


const getAllShoppingList = (req, res) => {

    try{
        let data = _db.getData("shopping_list");
        let shoppingList = Array.from(data);
        res.status(200).send({
            success: true,
            message: "Shopping list found successfully",
            info: shoppingList
        });

    }catch(error){
        console.error(error);
        res.status(500).send({
            success: false,
            message: "There was an error getting all shopping list",
            error: error.message
        });

    }

};



const getShoppingListByID = (req, res) => {

    try {
        let uuid = req.params.uuid;
        let data = _db.getData("shopping_list");
        let selectedList = data.get(uuid)
        res.status(200).send({
            succes: true,
            message: "Shopping list found succesfully",
            info: selectedList
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({
            succes: false,
            message: "There was an error getting the list",
            error: error.message
        });
    }
};


const updateShoppingListByID = (req, res) => {
    try {
      let body = req.body;
      let uuid = req.params.uuid;
      let data = _db.getData("shopping_list");
      let listSelected = body;
      let oldlist = data.get(uuid);

      if (oldlist) {
        data.set(uuid, { ...oldlist, ...listSelected });
        _db.writeDB(data, "shopping_list");
        res.status(200).send({
          success: true,
          message: "Shopping lists updated successfully",
          info: `list updated ${uuid}`,
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
        message: "There was an error trying to update shopping lists.",
        error: error.message,
      });
    }
  };

module.exports = { newShoppingList, getShoppingListByID, getAllShoppingList, updateShoppingListByID }