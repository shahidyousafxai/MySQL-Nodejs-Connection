const express = require('express')
const bodyparser = require('body-parser')
require('./config/db.config')
require('dotenv').config()

const app = express()

// Server Connection
const PORT = process.env.SERVER_PORT || 3001
app.listen(PORT, () => console.log(`Server Connected, Listion on Port ${PORT}`))
