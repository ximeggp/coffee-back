const express = require("express")
const router = express.Router()
const {getWishlist, addWishlist, updateWishlist, deleteWishlist} = require('../controllers/wishlistController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getWishlist)
router.post('/', protect, addWishlist)
router.put('/:id', protect, updateWishlist)
router.delete('/:id', protect, deleteWishlist)

module.exports = router