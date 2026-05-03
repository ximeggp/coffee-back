const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
const {errorHandler} = require('./middleware/errorMiddleware')
const cors = require("cors")

connectDB()

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/recomendaciones', require('./routes/recomendacionesRoutes'))
app.use('/api/users', require('./routes/usersRoutes'))
app.use('/api/wishlist', require('./routes/wishlistRoutes'))

app.use(errorHandler)

app.listen(port, ()=> console.log(`Servidor iniciado en el puerto ${port}`))