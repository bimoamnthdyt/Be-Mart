const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak, hanya admin yang bisa mengakses" });
    }
    next(); // Jika user adalah admin, lanjut ke controller berikutnya
  };
  
  module.exports = adminMiddleware;
  