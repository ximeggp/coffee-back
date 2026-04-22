const asyncHandler = require("express-async-handler")
const Recomendacion = require("../models/recomendacionesModel")

// obtener recomendaciones
const getCafeterias = asyncHandler(async(req, res) => {
    const cafeterias = await Recomendacion.find().populate("user", "nombre")
    res.status(200).json(cafeterias)
})

// crear recomendaciones
const addCafeterias = asyncHandler(async(req, res) => {
    if(!req.body.cafeteria) {
        res.status(400)
        throw new Error("Escribe la recomendación que tienes.")
    }
    if(!req.body.rating){
        res.status(400)
        throw new Error("Teclea la calificación que le darías (1-5)")
        
    }
    if(req.body.rating < 1 || req.body.rating > 5){
        res.status(400)
        throw new Error("La calificación debe ser entre 1 y 5, siendo este último lo máximo.")
        
    }

    const cafeteriarec = await Recomendacion.create({
        user: req.user.id,
        cafeteria: req.body.cafeteria,
        comentario: req.body.comentario,
        rating: req.body.rating,
    })

    if (cafeteriarec) {
        res.status(201).json(cafeteriarec)
    } else {
        res.status(500)
        throw new Error("chispas, ha ocurrido un error.")
    }
})

// actualizar recomendación
const updateCafeterias = asyncHandler(async(req, res) => {
    const cafeteriarec = await Recomendacion.findById(req.params.id)

    if(!cafeteriarec) {
        res.status(404)
        throw new Error("Recomendación no encontrada.")
    }

    if(cafeteriarec.user.toString() !== req.user.id) {
        res.status(403)
        throw new Error("No puedes editar esta recomendación.")
    }

    const actualizada = await Recomendacion.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true, runValidators: true}
    )

    res.status(200).json(actualizada)
})

// borrar recomendaciones
const deleteCafeterias = asyncHandler(async(req, res) => {
    const cafeteriarec = await Recomendacion.findById(req.params.id)

    if(!cafeteriarec) {
        res.status(404)
        throw new Error("Recomendación no encontrada.")
    } 

    if(cafeteriarec.user.toString() !== req.user.id) {
        res.status(403)
        throw new Error("No puedes eliminar esta recomendación.")
    }

    await Recomendacion.findByIdAndDelete(req.params.id)

    res.status(200).json({mensaje: "Recomendación eliminada."})
})

module.exports = {
    getCafeterias, addCafeterias, updateCafeterias, deleteCafeterias
}

