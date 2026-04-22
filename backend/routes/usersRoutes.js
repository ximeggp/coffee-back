const express = require("express")
const router = express.Router()

const {login, register, data} = require('../controllers/usersController')
const {protect} = require('../middleware/authMiddleware')

router.post('/login', login)
router.post('/register', register)

// endpoint privado
router.get('/data', protect, data)

module.exports = router