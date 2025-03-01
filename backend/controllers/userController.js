const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Ambil semua data user
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

const getUsersById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: "User Tidak temukan!"});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: "Terjadi Kesalahan Server"});
    }
};


module.exports = {getAllUsers, getUsersById};