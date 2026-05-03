const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    cafeteria: {
        type: String,
        required: [true, "Escribe el nombre de la cafetería"]
    },
    ubicaciom: {
        type: String
    },
    nota : {
        type: String
    }, 
    imagen: {
        type: String
    },
    visitado: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Wishlist', wishlistSchema)