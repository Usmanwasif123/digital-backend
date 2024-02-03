const express = require ("express")
const mongoose = require ("mongoose")
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const UserModel = require('./models/User')




require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST'],
    credentials: true

}))
app.use(cookieParser())


/*MONGOOSE SETUP*/
const PORT = process.env.PORT || PORT;
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log("DB Connection Successful")  
)
.catch((err)=>{
    console.log(err);
});

const verifyUser =(req, res, next) =>{
    const token= req.cookies.token;
    console.log('Received Token:', token);
    if(!token){
        return res.status(400).json("Token is missing")
        console.log(token)
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) =>{
            if(err){
                return res.status(403).json("Token is not valid!")
            } else {
                if(decoded.email){
                    req.user = decoded;
                    next()
                } else{
                    return res.status(401).json("You are not authenticated!")
                }
            }
        })
    }
}

/*verify the user when login into dashboard*/
app.get('/device', verifyUser, (req, res)=>{
    res.status(200).json("Success")
})



/* POST THE SIGUP*/
app.post('/signup', (req, res) =>{
    const{email, password} = req.body;
    bcrypt.hash(password, 10)
    .then(hash => {
        UserModel.create({email, password: hash})
        .then(user => res.status(200).json('Success'))
        .catch(err => res.status(500).json(err))
    }).catch(err => res.status(500).json(err))
})

/*post the SIGNIN*/
app.post('/signin', (req, res) =>{
    const{email, password}= req.body;
    UserModel.findOne({email: email})
    .then(user =>{
        if(user){
            bcrypt.compare(password, user.password, (err, response) =>{
                if(response){
                        const token = jwt.sign({email: user.email},
                            process.env.JWT_SECRET_KEY, {expiresIn: '1d'})
                            res.status(200).cookie('token', token)
                        return res.status(200).json({Status: "Success"})
                }else{
                    return res.status(403).json("The password is incorrect")
                }
            })
        }else{
            return res.status(401).json("No recored existed")
        }
    })
})


app.listen(PORT, () => {
    console.log(`Server is Running ${PORT}`)
})
