const { Router } = require('express')
const { register, login, getProfile } = require('../controllers/authController')
const { authenticateToken } = require('../middleware/auth')

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticateToken, getProfile)

module.exports = router
