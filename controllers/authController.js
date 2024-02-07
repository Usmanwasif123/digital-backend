const UserModel = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ActivityModel = require('../models/Activity')

const test = (req, res) => {
    res.json('test is working')
}

// Signup Endpoint
const SignupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email was entered
        if (!email) {
            return res.json({ error: 'email is required' });
        }
        // Check if password is valid
        if (!password || password.length < 6) {
            return res.json({ error: 'Password is required and should be at least 6 characters long' });
        }
        // Check email existence
        const exist = await UserModel.findOne({ email });
        if (exist) {
            return res.json({ error: 'Email is already taken' });
        }
        const hashedPassword = await hashPassword(password);
        // Create a user in the database
        const user = await UserModel.create({ email, password: hashedPassword });
        return res.json(user);
    } catch (error) {
        console.log(error);
    }
}

// Signin Endpoint
const SigninUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ error: 'No user found' });
        }
        // Check if password matches
        const match = await comparePassword(password, user.password);
        if (!match) {
            jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json({ user, message: 'User signed in successfully' });
            });
        }
        if (match) {
            return res.json({ error: 'Passwords do not match' });
        }
    } catch (error) {
        console.log(error);
    }
}

// User profile
const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        });
    } else {
        res.json(null);
    }
}

// Define adminSignIn within the exported object
const adminSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = 'admin@gmail.com'
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isPasswordValid ='admin123'
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET_KEY);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Admin profile
const getAdminProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        });
    } else {
        res.json(null);
    }
}
const getUserDetails = async (req, res) => {
    const userId = req.params.userId;
    // Fetch user details from the database
    const user = await UserModel.find();
    res.json(user);
};

const getUserActivities = async (req, res) => {
    const userId = req.params.userId;
    // Fetch user activities from the database
    const activities = await ActivityModel.find();
    res.json(activities);
}


module.exports = {
    test,
    SignupUser,
    SigninUser,
    getProfile,
    getAdminProfile,
    adminSignIn, // Add adminSignIn herey
    getUserDetails,
    getUserActivities,
}
