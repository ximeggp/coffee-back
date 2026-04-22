const express = require('express')
const router = express.Router()
const {getCafeterias, addCafeterias, updateCafeterias, deleteCafeterias} = require('../controllers/recomendacionesController')
const {protect} = require('../middleware/authMiddleware')

// get:
router.get('/', getCafeterias)

// add:
router.post('/', protect, addCafeterias)

// update:
router.put('/:id', protect, updateCafeterias)

// delete:
router.delete('/:id', protect, deleteCafeterias)

module.exports = router