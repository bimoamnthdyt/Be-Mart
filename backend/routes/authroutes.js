const express = require("express");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Contoh route yang membutuhkan autentikasi
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Ini halaman profil", user: req.user });
  });

module.exports = router;