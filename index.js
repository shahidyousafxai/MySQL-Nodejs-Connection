const express = require('express')
const bodyparser = require('body-parser')
require('./config/db.config')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Prisma Client
const { PrismaClient } = require('@prisma/client')

// Prisma client Init
const { test } = new PrismaClient()

// Get data
app.get('/', async (req, res) => {
  const user = await test.findMany({
    // where: {
    //   city: 'swabi',
    // },
  })
  res.json(user)
})

// Create Data
app.post('/user', async (req, res) => {
  const { name, city } = req.body
  const newUser = await test.create({
    data: {
      name: name,
      city: city,
    },
  })
  res.json(newUser)
  //   console.log(req.body)
})

// Server Connection
const PORT = process.env.SERVER_PORT || 3001
app.listen(PORT, () => console.log(`Server Connected, Listion on Port ${PORT}`))
