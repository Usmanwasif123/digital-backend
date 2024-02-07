const express = require('express')
const router  = express.Router()
const cors = require('cors')
const {test, SignupUser, SigninUser, getProfile, adminSignIn, getAdminProfile } = require('../controllers/authController')

//middleware
router.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000"
    })
)

router.get('/', test)
router.post('/signup', SignupUser)
router.post('/signin', SigninUser)
router.get("/device", getProfile)
router.post("/signin", adminSignIn)
router.get("/admin", getAdminProfile)

module.exports = router