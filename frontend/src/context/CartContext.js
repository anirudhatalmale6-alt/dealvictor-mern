import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update localStorage and totals when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated quantity in cart`);
        return updated;
      } else {
        toast.success(`${product.title} added to cart`);
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
