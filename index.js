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

// Get all data
app.get('/', async (req, res) => {
  const user = await test.findMany({})
  res.json(user)
})

// Create Data
app.post('/', async (req, res) => {
  const { name, city } = req.body
  const newUser = await test.create({
    data: {
      name,
      city,
    },
  })
  res.json(newUser)
})

// Delete Data
app.delete('/:id', async (req, res) => {
  const params = req.params.id
  const user = await test.findUnique({
    where: {
      id: parseInt(params),
    },
  })
  // // if(params ===)

  if (!user) {
    return res.status(400).json({
      msg: 'OOoopsss! User Not Found',
    })
  } else {
    const deleteuser = await test.delete({
      where: {
        id: parseInt(params),
      },
    })
    res.json({ msg: 'User Deleted Successfully' })
  }
})

// Server Connection
const PORT = process.env.SERVER_PORT || 3001
app.listen(PORT, () => console.log(`Server Connected, Listion on Port ${PORT}`))
