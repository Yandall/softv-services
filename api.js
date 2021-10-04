const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', require('./router'))

const port = 8080
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/api/`)
})
