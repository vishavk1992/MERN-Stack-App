import { useState, useContext, createContext } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([cart, setCart]);

  return (
    <CartContext.Provider value={[auth, setAuth]}>
      {children}
    </CartContext.Provider>
  );
};

//custome hook

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
