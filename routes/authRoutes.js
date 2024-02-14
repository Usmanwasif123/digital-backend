const express = require('express')
const router  = express.Router()
const cors = require('cors')
const {test, SignupUser, SigninUser, getProfile, adminSignIn, getAdminProfile, getUserDetails, getUserActivities } = require('../controllers/authController')

//middleware
router.use(
    cors({
        credentials: true,
        origin: process.env.origin
    })
)

router.get('/test', test)
router.post('/signup', SignupUser)
router.post('/signin', SigninUser)
router.get("/device", getProfile)
router.post("/signin", adminSignIn)
router.get("/admin", getAdminProfile)
router.get("/userId", getUserDetails);
router.get("/activities", getUserActivities);



module.exports = router