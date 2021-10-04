const fs = require("fs")

const getData = (entity) => {
    let data = fs.readFileSync(`./data/${entity}.json`)
    let list = JSON.parse(data)
    let db = new Map(list.list)
    return db
}

const has = (map, key, value) => {
    let items = map.values()
    for (let item of items) {
        if (item[key] === value) {
            return true
        }
    }
    return false
}

const writeDB = (db, entity) => {
    let newData = db.entries()
    newData = Array.from(db)
    newData = JSON.stringify({list: newData})
    fs.writeFileSync(`./data/${entity}.json`, newData)
}

module.exports = { getData, has, writeDB}