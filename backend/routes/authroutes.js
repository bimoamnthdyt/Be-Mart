const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Ini halaman profil", user: req.user });
});

// Verifikasi Token (Cek apakah token masih valid)
router.get("/verify", authMiddleware, (req, res) => {
    res.json({ message: "Token valid", user: req.user });
});

router.post("/logout", authMiddleware, logout);

module.exports = router;
