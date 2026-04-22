const mongoose = require("mongoose")

const recomendacionesSchema = mongoose.Schema({
    cafeteria: {
        type: String,
        required: [true, "No colocaste tu recomendación):"]
    },
    // agregar al front
    comentario: String,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Recomendacione", recomendacionesSchema)