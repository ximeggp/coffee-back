const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "Teclea tu bello nombre"]
    },
    email: {
        type: String,
        required: [true, "Teclea tu email"]
    },
    password: {
        type: String,
        required: [true, "Teclea tu contraseña"]
    },
    esAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)