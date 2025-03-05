import { useState, useEffect} from "react";
// import {useNavigate} from "react-router-dom";
import axios from "axios";

const ProductListUser = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  // const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch daftar produk dari backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Gagal mengambil produk", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tambahkan produk ke keranjang
  const addToCart = async (productId, stock, navigate) => {
    const quantity = quantities[productId] || 1;

    if (quantity > stock) {
      alert("Jumlah melebihi stok yang tersedia!");
      return;
    }
     if (!token) {
      alert("Silakan login terlebih dahulu untuk menambah ke keranjang.");
      return;
  }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Produk (${quantity} item) successfully added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const formatRupiah = (angka) => {
    return angka.toLocaleString("id-ID");
  };

  const handleQuantityChange = (productId, value, stock) => {
    const qty = Math.max(1, Math.min(stock, Number(value)));
    setQuantities((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>Product unavailable</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-700">Rp {formatRupiah(product.price)}</p>
              <p className="text-gray-500 text-sm">Stok: {product.stock}</p>

              {/* Input jumlah barang */}
              <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={quantities[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, e.target.value, product.stock)}
                    className="border border-black rounded px-2 py-1 w-10 text-center"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => addToCart(product._id, product.stock)}
                    className="bg-orange-400 text-white text-sm border-2 border-transparent px-3 py-1 rounded-lg"
                  >
                    Add to cart 
                  </button>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListUser;
