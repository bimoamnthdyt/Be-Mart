import { useState, useEffect } from "react";

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
  });

  const [errors, setErrors] = useState({});

  // Set data saat edit produk
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: "", price: "", stock: "", description: "", category: "" });
    }
  }, [product]);

  // Fungsi validasi
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama produk tidak boleh kosong!";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Harga harus angka dan tidak kosong !";
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0)
      newErrors.stock = "Stok harus angka 0 atau lebih!";
    if (!formData.description.trim() || formData.description.length < 5)
      newErrors.description = "Deskripsi minimal 5 karakter!";
    if (!formData.category.trim()) newErrors.category = "Pilih kategori produk!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true jika tidak ada error
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">{product ? "Edit Produk" : "Tambah Produk"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-semibold">Nama Produk</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold">Harga</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold">Stok</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih Kategori</option>
                <option value="Ikan dan Daging">Ikan dan Daging</option>
                <option value="Buah Buahan">Buah-buahan</option>
                <option value="Minuman">Minuman</option>
                <option value="Makanan Segar">Makanan segar</option>
                <option value="Makanan Siap Saji">Makanan siap saji</option>
                <option value="Barang Rumah Tangga">Barang rumah tangga</option>
                <option value="Produk Kecantikan">Produk kecantikan</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div className="flex justify-end mt-4">
              <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
                Batal
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductModal;
