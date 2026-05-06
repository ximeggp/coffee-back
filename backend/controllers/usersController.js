const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    // verifico que el usuario existe
    const user = await User.findOne({email})

    if(!user) {
        res.status(404)
        throw new Error("El usuario no existe")   
    }

    const passwordCorrecta = await bcrypt.compare(password, user.password)

    if(!passwordCorrecta) {
        res.status(401)
        throw new Error("Contraseña incorrecta):");
        
    }

    res.status(200).json({
        _id: user.id,
        nombre: user.nombre,
        token: generarToken(user.id)
    })
})

const register = asyncHandler(async(req, res) => {
    const {nombre, email, password} = req.body

    if(!nombre || !email || !password) {
        res.status(400)
        throw new Error("Hay datos que no fueron ingresados.")
    }

    //verifico la existencia del usuario en la BD
    const userExiste = await User.findOne({email})

    if (userExiste) {
        res.status(400)
        throw new Error("Ese usuario ya existe <3"); 
    } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // creo el user
        const user = await User.create({
            nombre,
            email,
            password: hashedPassword
        })

        if (user) {
            res.status(201).json({
                _id: user.id,
                nombre: user.nombre,
                email: user.email,
            })
        } else {
            res.status(400)
            throw new Error("Hubo un error al guardar los datos.")
        }
    }
})

const data = (req, res) => {
    res.status(200).json(req.user)
}

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    login, register, data
}