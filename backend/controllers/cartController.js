const Cart = require("../models/Cart");
const Product = require("../models/Product");

// menambahkan produk ke keranjang 
  const addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      if (quantity > product.stock) {
        return res.status(400).json({ message: "Jumlah melebihi stok yang tersedia" });
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        if (cart.items[itemIndex].quantity > product.stock) {
          return res.status(400).json({ message: "Jumlah total di keranjang melebihi stok!" });
        }
      } else {
        cart.items.push({
          productId: product._id,
          image: product.image,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity,
        });
      }

      await cart.save();
      res.status(201).json({ message: "Produk berhasil ditambahkan", cart });
    } catch (error) {
      console.error("Error addToCart:", error);
      res.status(500).json({ message: "Gagal menambahkan produk ke keranjang", error });
    }
  };



  // get isi keranjang user 
  const getCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      if (!cart || cart.items.length === 0) {
        return res.json({ message: "Keranjang kosong", items: [], totalPrice: 0 });
      }

      let totalPrice = 0;
      const formattedCart = {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items
          .map((item) => {
            if (!item.productId) return null;
            
            const product = item.productId;
            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            return {
              _id: item._id,
              productId: product._id,
              image: product.image || "https://via.placeholder.com/150", 
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: item.quantity,
              total: itemTotal,
            };
          })
          .filter((item) => item !== null),

        totalPrice,
      };

      res.json(formattedCart);
    } catch (error) {
      console.error("Error getCart:", error);
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

  module.exports = { addToCart, getCart, updateCartItem, removeCartItem};