import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { ToastContext } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  // Sync cart items with Backend if logged in, otherwise localStorage
  const fetchCart = async () => {
    if (user && user.role === 'USER') {
      try {
        const { data } = await api.get('/cart');
        const mapped = data.map((item) => ({
          _id: item._id, // database Cart item ID
          product: item.product?._id || item.product, // Product ID
          name: item.title || item.product?.name || 'Product',
          image: item.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
          price: item.price,
          countInStock: item.product?.countInStock !== undefined ? item.product.countInStock : 10,
          qty: item.quantity,
          size: item.size,
          discount: item.discount || 0,
        }));
        setCartItems(mapped);
      } catch (err) {
        console.error('Failed to load database cart', err);
      }
    } else {
      const localCart = localStorage.getItem('cartItems');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Sync to local storage (only for guest / safety backup)
  const syncLocal = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = async (product, qty, size = 'M') => {
    if (user && user.role === 'USER') {
      try {
        await api.post('/cart', {
          productId: product._id || product.product,
          quantity: Number(qty),
          size,
        });
        await fetchCart(); // Reload from db
        showToast(`Added ${qty} x ${product.name || 'item'} (Size: ${size}) to cart!`, 'success');
      } catch (err) {
        console.error('Failed to add cart item to database', err);
        showToast('Failed to add item to cart', 'error');
      }
    } else {
      const pId = product._id || product.product;
      const existItem = cartItems.find((x) => x.product === pId && x.size === size);

      if (existItem) {
        const updated = cartItems.map((x) =>
          x.product === pId && x.size === size ? { ...x, qty: Number(qty) } : x
        );
        syncLocal(updated);
      } else {
        const newItem = {
          product: pId,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock !== undefined ? product.countInStock : 10,
          qty: Number(qty),
          size,
          discount: product.discount || 0,
        };
        syncLocal([...cartItems, newItem]);
      }
      showToast(`Added ${qty} x ${product.name || 'item'} (Size: ${size}) to cart!`, 'success');
    }
  };

  const updateCartQty = async (cartItem, qty) => {
    if (user && user.role === 'USER' && cartItem._id) {
      try {
        await api.put(`/cart/${cartItem._id}`, { quantity: Number(qty) });
        await fetchCart();
        showToast('Cart quantity updated', 'success');
      } catch (err) {
        console.error('Failed to update cart item quantity', err);
        showToast('Failed to update quantity', 'error');
      }
    } else {
      const updated = cartItems.map((x) =>
        x.product === cartItem.product && x.size === cartItem.size
          ? { ...x, qty: Number(qty) }
          : x
      );
      syncLocal(updated);
      showToast('Cart quantity updated', 'success');
    }
  };

  const removeFromCart = async (id) => {
    // If logged in, we need the database cartItem ID, otherwise product ID
    if (user && user.role === 'USER') {
      try {
        // Find the matching db ID from our local memory first
        const item = cartItems.find((x) => x._id === id || x.product === id);
        if (item && item._id) {
          await api.delete(`/cart/${item._id}`);
        }
        await fetchCart();
        showToast('Item removed from cart', 'info');
      } catch (err) {
        console.error('Failed to remove cart item from database', err);
        showToast('Failed to remove item', 'error');
      }
    } else {
      const updated = cartItems.filter((x) => x.product !== id);
      syncLocal(updated);
      showToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (user && user.role === 'USER') {
      try {
        // Clear items one by one or rely on local clearing since checkout will clear db items
        for (const item of cartItems) {
          if (item._id) {
            await api.delete(`/cart/${item._id}`);
          }
        }
        setCartItems([]);
      } catch (err) {
        console.error('Failed to clear database cart', err);
      }
    } else {
      syncLocal([]);
    }
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  // Calculate total price accounting for discounts
  const cartTotalPrice = cartItems.reduce((acc, item) => {
    const discountAmount = item.discount ? (item.price * item.discount) / 100 : 0;
    const finalPrice = item.price - discountAmount;
    return acc + finalPrice * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartItemsCount,
        cartTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
