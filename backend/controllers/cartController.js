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
      const cart = await Cart.findOne({ userId });
  
      if (!cart || cart.items.length === 0) {
        return res.json({ message: "Keranjang kosong", items: [] });
      }
  
      // Cek apakah produk masih ada di database
      const updatedItems = [];
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          updatedItems.push(item);
        }
      }
  
      // Perbarui keranjang jika ada produk yang sudah dihapus dari database
      if (updatedItems.length !== cart.items.length) {
        cart.items = updatedItems;
        await cart.save();
      }
  
      res.json(cart);
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
      if (!cart) {
        return res.status(404).json({ message: "Keranjang tidak ditemukan" });
      }
  
      const itemIndex = cart.items.findIndex((item) => String(item.productId) === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Produk tidak ada di keranjang" });
      }
  
      // Update jumlah produk dalam keranjang
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
  
      res.json({ message: "Jumlah produk berhasil diperbarui", cart });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
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