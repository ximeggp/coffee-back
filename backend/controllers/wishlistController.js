const asyncHandler = require("express-async-handler")
const Wishlist = require('../models/wishlistModel')

// que cada user pueda ver su wishlist
const getWishlist = asyncHandler(async(req, res) => {
    const lista = await Wishlist.find({user: req.user.id})
    res.status(200).json(lista)
})

// que el user pueda agregar a su wishlist
const addWishlist = asyncHandler(async(req, res) => {
    const {cafeteria, nota, imagen} = req.body

    if (!cafeteria) {
        res.status(400)
        throw new Error("Escribe una cafetería")
    }

    const nueva = await Wishlist.create({
        cafeteria,
        nota,
        imagen,
        user: req.user.id
    })

    res.status(201).json(nueva)
})

// cambiar de estado "no visitado" a visitado
const updateWishlist = asyncHandler(async(req, res) => {
    const item = await Wishlist.findById(req.params.id)

    if (!item) {
        res.status(404)
        throw new Error("No encontrado")
    }

    if (item.user.toString() !== req.user.id) {
        res.status(403)
        throw new Error("No autorizado para editar esta lista")
    }

    const actualizado = await Wishlist.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )

    res.status(200).json(actualizado)
})

const deleteWishlist = asyncHandler(async(req, res) => {
    const item = await Wishlist.findById(req.params.id)
    if (!item) {
        res.status(404)
        throw new Error("No encontrado")
    }

    if (item.user.toString() !== req.user.id) {
        res.status(403)
        throw new Error("No autorizado para eliminar")
    }

    await Wishlist.findByIdAndDelete(req.params.id)

    res.status(200).json({mensaje: "Cafetería eliminada"})
})

module.exports = {
    getWishlist, addWishlist, updateWishlist, deleteWishlist
}