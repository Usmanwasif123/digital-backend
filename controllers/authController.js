const User = require('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')



const test= (req, res) =>{
    res.json('test is working')
}

//Signup Endpoint
const SignupUser = async (req, res) =>{
        try {
            const {email, password} = req.body;
            //Check if email was enter
            if(!email){
                return res.json({
                    error: 'email is required'
                })
            };
            //Check is password is good
            if(!password || password.length < 6){
                return res.json({
                    error: 'Password is required and should be at least 6 characters long'
                })

            };
            //Check email
            const exist = await User.findOne({email});
            if(exist) {
                return res.json({
                    error: 'Email is taken already'
                })
            }
            const hashedPassword = await hashPassword(password)
            //Create a user in database
            const user = await User.create({
                email, password: hashedPassword,
            })

            return res.json(user)
        } catch (error) {
            console.log(error)
        }
}


//Login Endpoint
const SigninUser = async (req, res) => {
 try{
    const {email, password} = req.body;

    //Check if user exist
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: 'No user found'
            })
        }
        //Check if password match
        const match = await comparePassword(password, user.password)
        if(match) {
            jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET_KEY, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(user)
            })
        }
        if(!match) {
            res.json({
                error: 'Passwords do not match'
            })
        }
 } catch (error){
    console.log(error)

 }
}

//User profile
const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, user) => {
            if(err)  throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }
}


module.exports={
    test,
    SignupUser,
    SigninUser,
    getProfile
}