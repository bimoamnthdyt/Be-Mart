import { useState, useEffect } from "react";

const categories = ["Elektronik", "Pakaian", "Makanan", "Minuman", "Perabotan"];

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]); 

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description || "");
      setCategory(product.category || categories[0]);
    } else {
      setName("");
      setPrice("");
      setStock("");
      setDescription("");
      setCategory(categories[0]);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, price, stock, description, category }); // Kirim data yang diperbarui
  };

  if (!isOpen) return null; // Jangan tampilkan modal jika tidak dibuka

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">
        {product ? "Edit Produk" : "Tambah Produk"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm font-medium">Nama Produk</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Harga</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Stok</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
            <label className="block text-sm font-medium">Deskripsi</label>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Kategori</label>
          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ProductModal;
