const express = require('express');
const router = express.Router();
const { getAllUsers, getUsersById} = require('../controllers/userController');
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/// Route: Ambil semua User
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

// Route: Ambil user berdasarkan ID
router.get("/:id", authMiddleware, adminMiddleware, getUsersById);

module.exports = router;