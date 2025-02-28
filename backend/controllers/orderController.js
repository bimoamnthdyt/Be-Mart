const Order = require("../models/Order");
const Cart = require("../models/Cart");

// co dari keranjang
const checkout = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Ambil keranjang user
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Keranjang kosong!" });
      }
  
      // Hitung total harga
      const totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Simpan pesanan baru
      const newOrder = new Order({
        userId,
        items: cart.items,
        totalPrice,
        paymentStatus: "pending",
        pickupStatus: "belum diambil",
      });
  
      await newOrder.save();
  
      // Kosongkan keranjang setelah checkout
      await Cart.findOneAndDelete({ userId });
  
      res.status(201).json({ message: "Checkout berhasil! Silakan lakukan pembayaran.", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  };

  // simulasi pembayaran
  const payOrder = async (req, res) => {
    try {
        const {orderId} = req.params;
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message: "pesan tidak ditemukan"});
        }

        if(order.paymentStatus === "dibayar") {
            return res.status(400).json({message: "Pesanan Sudah dibayar!"});
        }

        order.paymentStatus =  "dibayar";
        order.pickupStatus = "siap diambil";
        await order.save();

        res.json({message: "Pembayaran berhasil! Pesanan siap diambil", order});
    } catch (error) {
        res.status(500).json({message: "Terjadi Kesalahan!", error: error.message});
    }
  };

  // user melihat pesanan 
  const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({userId}).sort({createdAt: -1});

        res.json(orders);
    }catch(error){
        res.status(500).json({message: "Terjadi kesalahan", error: error.message});
    }
  };


  // admin update status pengambilan 
  const updateStatusPickup = async (req, res) => {
    try {
        const {orderId} = req.params;
        const {pickupStatus} = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({message: "Pesanan tidak ditemukan!"});
        }
        
        order.pickupStatus = pickupStatus;
        if(pickupStatus === "sudah diambil") {
          order.status = "selesai";
        }

        await order.save();
        res.json({message: "Status pengembalian diperbarui", order});
    }catch (error) {
        res.status(500).json({message: "Terjadi Kesalahan", error: error.message});
    }
  };


  module.exports = {checkout, payOrder, getUserOrders, updateStatusPickup};