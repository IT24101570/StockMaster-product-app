import React, { createContext, useState, useContext } from 'react';

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  qty: number; // quantity in cart
};

type ProductContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
};

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const ProductProvider = ({ children }: React.PropsWithChildren) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          // Check if new qty exceeds available stock
          const maxQty = item.quantity; // original stock quantity
          const newQty = qty > maxQty ? maxQty : qty;
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => 
    cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const getCartItemCount = () => 
    cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <ProductContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);