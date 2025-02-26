import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement("#root");

function ProductForm({isOpen, closeModal, refreshProducts, editProduct }) {
    const [product, setProduct] = useState({name:"", price:"", stock:""});

    //form dalam mode edit
    useEffect(() => {
        if (editProduct) {
        setProduct(editProduct);
        } else {
        setProduct({ name: "", price: "", stock: "" });
        }
    }, [editProduct]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (editProduct) {
            axios.put(`http://localhost:5000/products/${editProduct._id}`, {
                ...product, 
                price: Number(product.price), 
                stock: Number(product.stock) 
            })
            .then(() => {
                refreshProducts();
                closeModal();   
            })
            .catch(err => console.log("error update Product:", err));
        }else{
        // tambah baru setelah edit
        axios.post("http://localhost:5000/products", product)
        .then(() => {
            refreshProducts();
            closeModal();
        })
        .catch(err => console.error("Error Menambahkan Product:", err))
        }
    };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="bg-white p-5 rounded-lg shadow-lg w-96 mx-auto mt-20">
    <h2 className="text-xl font-bold mb-4">
      {editProduct ? "Edit Produk" : "Tambah Produk"}
    </h2>

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nama Produk"
        className="border p-2 w-full mb-2"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Harga"
        className="border p-2 w-full mb-2"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />

      <input
        type="number"
        placeholder="Stok"
        className="border p-2 w-full mb-2"
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
      />

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
        {editProduct ? "Update" : "Simpan"}
      </button>
    </form>
  </Modal>
  );
}

export default ProductForm;