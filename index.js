const express = require('express')
const session = require('express-session')
const mysql2 = require('mysql2/promise')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { hash, compare } = require('./auth')
const MySQLStore = require('express-mysql-session')(session)
require('./config/db.config')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}
const connection = mysql2.createPool(options)
const sessionStore = new MySQLStore({}, connection)

// ----------Prisma Client----------
const { PrismaClient } = require('@prisma/client')

// ----------Prisma client Init----------
const { test } = new PrismaClient()

// ----------Express Session----------
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 24 * 60 * 60 },
  })
)

// ----------Passport Initail----------
app.use(passport.initialize())
app.use(passport.session())

// ----------Passport verifyCallback----------
const verifyCallback = async (username, password, done) => {
  try {
    const user = await test.findMany({
      where: {
        name: username,
      },
    })
    if (!user) {
      return done(null, false, {
        msg: 'User Not Found',
        statusCode: 400,
      })
    }

    // ----------Passport Password Compare----------
    const res = await compare(hash, user.password)
    if (res) {
      return done(null, user)
    } else {
      return done(null, false, {
        message: 'Invalid Credentials',
        statusCode: 401,
      })
    }
  } catch (err) {
    console.error(err.message)
    return done(err)
  }
}
// ----------Passport LocalStrategy----------
const strategy = new LocalStrategy(
  { usernameField: 'name', passwordField: 'password' },
  verifyCallback
)
passport.use(strategy)

// ----------Passport SerializeUser----------
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// ----------Passport deserializeUser----------
passport.deserializeUser(function (user, done) {
  test
    .findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        password: true,
      },
    })
    .then((res) => done(null, res))
    .catch((err) => done(err))
})

// ----------Get all data----------
app.get('/user/:id', async (req, res) => {
  req.session.isAuth = true
  const paramid = req.params.id
  const user = await test.findUnique({
    where: {
      id: parseInt(paramid),
    },
  })
  if (user.length === 0) {
    return res.status(400).json({
      msg: 'No Users',
    })
  }
  res.json(user)
})

// ----------Create Data----------
app.post('/', async (req, res) => {
  const { name, password } = req.body
  const newUser = await test.create({
    data: {
      name,
      password: await hash(password),
    },
  })
  res.json(newUser)
})

// ----------Verify Data----------
const resObj = {
  message: 'success',
}
app.post('/test', passport.authenticate('local'), async (req, res) => {
  req.user.id = parseInt(req.user.id)
  resObj.data = req.user
  res.status(201)
  return res.json(resObj)
})

// ----------Delete Data----------
app.delete('/:id', async (req, res) => {
  const params = req.params.id
  const user = await test.findUnique({
    where: {
      id: parseInt(params),
    },
  })

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

// ----------Server Connection----------
const PORT = process.env.SERVER_PORT || 3001
app.listen(PORT, () => console.log(`Server Connected, Listion on Port ${PORT}`))
