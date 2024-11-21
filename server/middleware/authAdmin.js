const Users = require('../models/userModels')

const authAdmin = async (req,res,next) =>{
    try {
        const user = await Users.findOne({
            _id : req.user.id,
        })

        if(user.role === 0)
        return res.status(400).json("Access denied to ADMIN resources")

        next()
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = authAdmin