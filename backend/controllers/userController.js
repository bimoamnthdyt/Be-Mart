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

const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Jangan update password jika tidak diubah
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user", error });
  }
};
  


module.exports = {getAllUsers, getUsersById, updateUser};