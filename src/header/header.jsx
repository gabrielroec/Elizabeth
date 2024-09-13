import { useState, useEffect } from "react";

const Header = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Gerenciar o estado do Drawer
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch menu data
  useEffect(() => {
    const menuElement = document.getElementById("header");
    const menuData = menuElement.getAttribute("data-menu");

    if (menuData) {
      try {
        const parsedMenu = JSON.parse(menuData);
        if (Array.isArray(parsedMenu)) {
          setMenuItems(parsedMenu);
        } else {
          console.error("Parsed menu data is not an array");
        }
      } catch (error) {
        console.error("Error parsing menu data:", error);
      }
    } else {
      console.error("Menu items are empty or not defined");
    }
  }, []);

  // Fetch cart data
  useEffect(() => {
    if (isCartOpen) {
      fetch("/cart.js")
        .then((res) => res.json())
        .then((cart) => {
          setCartItems(cart.items);
          setTotalPrice(cart.total_price);
        })
        .catch((error) => console.error("Error fetching cart data:", error));
    }
  }, [isCartOpen]);

  // Function to update cart quantity via AJAX
  const updateCartQuantity = (lineItemKey, quantityChange) => {
    const item = cartItems.find((i) => i.key === lineItemKey);
    if (!item) return;

    const newQuantity = item.quantity + quantityChange;
    if (newQuantity < 0) return;

    fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: lineItemKey,
        quantity: newQuantity,
      }),
    })
      .then((res) => res.json())
      .then((cart) => {
        setCartItems(cart.items);
        setTotalPrice(cart.total_price);
      })
      .catch((error) => console.error("Error updating cart:", error));
  };

  // Function to remove an item
  const removeItem = (lineItemKey) => {
    updateCartQuantity(lineItemKey, -cartItems.find((item) => item.key === lineItemKey).quantity);
  };

  return (
    <>
      <header className="site-header relative">
        <div className="container mx-auto">
          <div className="header-content flex justify-between items-center py-4">
            {/* Logo */}
            <div className="logo">
              <a href="/">
                <img src="/assets/logo-kidu.svg" alt="Kidu Logo" width="150" height="auto" />
              </a>
            </div>

            {/* Menu */}
            <nav className="main-menu">
              <ul className="flex space-x-6">
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <li key={item.id}>
                      <a href={item.url} className="text-lg hover:text-blue-600">
                        {item.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>Carregando...</li>
                )}
              </ul>
            </nav>

            {/* Account and Cart */}
            <div className="header-icons flex space-x-4 items-center">
              <a href="/account" className="text-lg hover:text-blue-600 flex items-center">
                <img src="/assets/user-svgrepo-com.svg" alt="Account" className="w-8" />
              </a>

              <button onClick={() => setIsCartOpen(true)} className="cart-toggle text-lg hover:text-blue-600 relative">
                <img src="/assets/bag-svgrepo-com.svg" alt="Cart" className="w-8" />
                <span className="cart-count absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2">
                  {cartItems.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Cart Drawer */}
        <div
          className={`cart-drawer fixed right-0 top-0 w-1/2 h-full bg-white shadow-lg transition-transform transform z-50 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="cart-drawer-header p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold">MY CART</h2>
            <button onClick={() => setIsCartOpen(false)} className="cart-drawer-close text-2xl">
              &times;
            </button>
          </div>

          <div className="cart-drawer-body p-4">
            {cartItems.length > 0 ? (
              <ul id="cart-items" className="cart-items-list">
                {cartItems.map((item) => (
                  <li key={item.key} className="cart-item flex justify-between items-center mb-4">
                    <div className="cart-item-info">
                      <p className="text-sm">{item.product_title}</p>
                      <p className="text-xs text-gray-500">
                        Quantidade:
                        <button className="decrease-qty" onClick={() => updateCartQuantity(item.key, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button className="increase-qty" onClick={() => updateCartQuantity(item.key, 1)}>
                          +
                        </button>
                      </p>
                      <button className="remove-item text-red-500" onClick={() => removeItem(item.key)}>
                        Remover
                      </button>
                    </div>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.product_title} className="w-16 h-16" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">Seu carrinho está vazio.</p>
            )}
          </div>

          <div className="cart-drawer-footer mt-4 p-4">
            <p className="font-bold text-lg">
              Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalPrice / 100)}
            </p>

            <a href="/cart" className="btn btn-primary mt-4 block text-center">
              Ver Carrinho
            </a>
            <a href="/checkout" className="btn btn-secondary mt-2 block text-center">
              Finalizar Compra
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
