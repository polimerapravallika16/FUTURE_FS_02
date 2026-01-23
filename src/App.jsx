import { useState, useEffect } from "react";
import productsData from "./products.json";

export default function App() {
  const [products] = useState(productsData);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const found = cart.find(item => item.id === product.id);
    if (found) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id, change) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + change) }
        : item
    ));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    setCart([]);
    setShowCheckout(false);
  };

  const categories = ["All", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">🛍️ Mini E-Commerce Store</h1>
      <p className="text-gray-600 mb-6">Shop from our collection of quality products</p>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <input
          className="border-2 border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-white border-2 border-gray-200 p-5 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                <h2 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h2>
                <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition font-semibold"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-center py-8">No products found</p>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🛒 Cart ({cartCount})</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No items in cart</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQty(item.id, -1)}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, 1)}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                  >
                    +
                  </button>
                  <button
                    className="ml-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                  <p className="ml-4 font-bold text-gray-800 w-20 text-right">₹{item.price * item.qty}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-6 pt-4 border-t-2 border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-blue-600">₹{cartTotal}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition text-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Checkout</h3>
            <form onSubmit={handleCheckout}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border-2 border-gray-300 p-2 mb-3 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border-2 border-gray-300 p-2 mb-3 rounded"
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border-2 border-gray-300 p-2 mb-3 rounded"
                required
              />
              <div className="bg-gray-100 p-3 mb-4 rounded">
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="text-2xl font-bold text-blue-600">₹{cartTotal}</p>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition mb-2"
              >
                Place Order
              </button>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}