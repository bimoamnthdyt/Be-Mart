const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { json } = require("express");
const jwt = require("jsonwebtoken");

// fungsi registrasi
const register = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        // pengecekan email
        const cekEmail = await User.findOne({email});
        if(cekEmail) return res.status(400).json({message: "Email sudah digunakan!"});

        //hash password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //simpen user baru 
        const newUser = new User({name, email, password: hashedPassword, role});
        await newUser.save();

        res.status(201).json({message: "Registrasi Berhasil !"});
    }catch {
        res.status(500).json({message: "Terjadi kesalahan", error});
    }
};

// fungsi Login
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //cek apakah user ada 
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).json({message: "User tidak ditemukan"});

        // cek password 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({message: "Password Salah"});

        //membuat token JWT
        const token = jwt.sign(
            {id: user._id, role: user.role}, 
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        
        res.status(200).json({message: "Login Berhasil !", token, user});
    }catch (error) {
        res.status(500).json({message: "Terjadi kesalahan", error});
    }
};

module.exports = {register, login};