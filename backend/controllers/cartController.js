const Cart = require("../models/Cart");
const Product = require("../models/Product");

// menambahkan produk ke keranjang 
const addToCart = async (req, res) => {
    try{
        const { productId, quantity} = req.body;
        const userId = req.user.id; // dari token JWt

        //ngecek produk ada 
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({message: "Produk tidak ditemukan!"});
        }

        // cek user sudah ada keranjang 
        let cart = await Cart.findOne({ userId });
        if(!cart){
            cart = new Cart({userId, items: [] });
        }

        // ngecek produk sudah ada di keranjang 
        const itemIndex = cart.items.findIndex((item) => item.productId.equals(productId));
        if (itemIndex > -1 ) {
            //klo udah ada Update quantity
            cart.items[itemIndex].quantity += quantity;
        }else{
            //klo blom ada tambah keranjang
            cart.items.push({
                productId,
                name: product.name,
                price: product.price,
                quantity,
            });
        }
        await cart.save();
        res.json({message: "Produk berhasil ditambah ke keranjang", cart});
    }catch (error){
        res.status(500).json({message: "Terjadi Kesalahan", error:error.message});
    }
};

// get isi keranjang user 
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId"); // ✅ Ambil data lengkap produk

    if (!cart || cart.items.length === 0) {
      return res.json({ message: "Keranjang kosong", items: [] });
    }

    // Konversi hasil populate agar sesuai dengan frontend
    const formattedCart = {
      _id: cart._id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        _id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      })),
    };

    res.json(formattedCart);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};  


  //Update Jumlah Produk di keranjang
  const updateCartItem = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Keranjang tidak ditemukan" });

      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex === -1) return res.status(404).json({ message: "Produk tidak ada di keranjang" });

      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Gagal memperbarui keranjang", error });
    }
  };


  // hapus product dari keranjang 
  const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const {productId} = req.params;

        const cart = await Cart.findOne({userId});
        if (!cart) {
            return res.status(404).json({message: "keranjang tidak ditemukan"});
        }

        cart.items = cart.items.filter((item) => !item.productId.equals(productId));
        await cart.save();

        res.json({message: "Produk berhasil dihapus dari keranjang!"});
    } catch (error){
        res.status(500).json({message: "terjadi kesalahan", error: error.message});
    }
  };

  module.exports = { addToCart, getCart, updateCartItem, removeCartItem };