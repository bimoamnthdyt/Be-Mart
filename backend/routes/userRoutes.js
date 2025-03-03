const express = require('express');
const router = express.Router();
const { getAllUsers, getUsersById, updateUser } = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/// Route: Ambil semua User
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

// Route: Ambil user berdasarkan ID
router.get("/:id", authMiddleware, adminMiddleware, getUsersById);


//Route : Edit 
router.put("/:id", authMiddleware, adminMiddleware, updateUser);

module.exports = router;