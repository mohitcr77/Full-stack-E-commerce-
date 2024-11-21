const Users = require('../models/userModels');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "Email already registered" });
            }
            if (password.length < 6) {
                return res.status(400).json({ msg: "Password should be more than 6 digits long" });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                name,
                email,
                password: passwordHash
            });

            // Save to MongoDB
            await newUser.save();

            // Create JWT (JSON Web Token) for authentication
            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            res.status(201).json({ accessToken });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;

            if (!rf_token) {
                return res.status(400).json({ msg: "Please login or register" });
            }

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register" });

                const accessToken = createAccessToken({ id: user.id });
                res.json({ user,accessToken });
            });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body;

            const user =  await Users.findOne({email})
            if(!user){
                return res.status(400).json({msg: "User does not exist"})
            }
            const isMatch =  await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect Password"})

            // Create JWT (JSON Web Token) for authentication
            const accessToken = createAccessToken({ id: user._id });
            const refreshToken = createRefreshToken({ id: user._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            res.json({accessToken})
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    logout : async (req, res) =>{
        try {
            res.clearCookie('refreshToken', {path:'/user/refresh_token'})
            res.status(200).json({msg:"Logout"})
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser : async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:"User not found"})
            res.json(user)
        } catch (error) {   
            return res.status(500).json({ msg: error.message });
        }
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = userCtrl;
