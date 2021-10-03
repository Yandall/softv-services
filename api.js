const express = require("express")
const cors = require("cors")


const app = express()

app.use(cors())

const server = require('http').createServer(app)

app.use('/', require('./router/index'))

const port = 8080
server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
})
