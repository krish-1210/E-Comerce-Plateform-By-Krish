import React, { useState, useEffect, createContext, useContext } from 'react';

// --- MOCK DATA & API ---
// In a real application, this data would come from your Node.js backend & MongoDB/MySQL database.
const initialProducts = [
  {
    id: 1,
    name: 'Quantum-Core Laptop',
    category: 'Electronics',
    price: 1299.99,
    rating: 4.5,
    stock: 15,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Quantum+Laptop',
    description: 'A powerful laptop with a next-gen quantum processor, 32GB RAM, and a 1TB NVMe SSD. Perfect for developers and creators.'
  },
  {
    id: 2,
    name: 'Ergo-Comfort Office Chair',
    category: 'Furniture',
    price: 349.50,
    rating: 4.8,
    stock: 30,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Ergo+Chair',
    description: 'Experience unparalleled comfort with our ergonomic office chair, featuring lumbar support and breathable mesh.'
  },
  {
    id: 3,
    name: 'Organic Arabica Coffee Beans',
    category: 'Groceries',
    price: 22.99,
    rating: 4.9,
    stock: 100,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Coffee+Beans',
    description: '1kg of single-origin, fair-trade, organic Arabica coffee beans. Medium roast with notes of chocolate and citrus.'
  },
  {
    id: 4,
    name: 'Smart Fitness Watch',
    category: 'Electronics',
    price: 199.00,
    rating: 4.3,
    stock: 45,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Smart+Watch',
    description: 'Track your fitness goals, monitor your heart rate, and receive notifications on the go. Waterproof and stylish.'
  },
  {
    id: 5,
    name: 'Modern Minimalist Desk',
    category: 'Furniture',
    price: 450.00,
    rating: 4.6,
    stock: 20,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Minimalist+Desk',
    description: 'A sleek and modern desk made from sustainable oak. Provides a large workspace with a minimalist aesthetic.'
  },
  {
    id: 6,
    name: 'Gourmet Chocolate Collection',
    category: 'Groceries',
    price: 45.99,
    rating: 4.9,
    stock: 60,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Chocolates',
    description: 'An assortment of 24 handcrafted gourmet chocolates from around the world. The perfect gift for any occasion.'
  },
  {
    id: 7,
    name: 'Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 279.99,
    rating: 4.7,
    stock: 25,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Headphones',
    description: 'Immerse yourself in sound with industry-leading noise cancellation and high-fidelity audio. 30-hour battery life.'
  },
  {
    id: 8,
    name: 'Artisan Sourdough Bread',
    category: 'Groceries',
    price: 8.50,
    rating: 4.8,
    stock: 50,
    imageUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=Sourdough',
    description: 'A freshly baked loaf of artisan sourdough bread, made with organic flour and a traditional starter.'
  },
];

// --- Simulated API ---
// TODO: Replace these functions with actual fetch() calls to your backend API.
const api = {
  getProducts: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(initialProducts), 500);
    });
  },
  login: async (email, password) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        id: 'user123',
        name: 'Alex Doe',
        email: email,
        isAdmin: email.startsWith('admin'), // Simple admin check for demo
        token: 'fake-jwt-token'
      }), 500);
    });
  },
  // In a real app, payment processing would be a multi-step process
  // involving communication with both your backend and the Stripe API.
  processPayment: async (cart, paymentDetails) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              if (cart.length > 0 && paymentDetails.cardNumber) {
                  resolve({ success: true, transactionId: `txn_${Date.now()}` });
              } else {
                  reject({ success: false, message: 'Invalid payment details or empty cart.' });
              }
          }, 1000);
      });
  }
};

// --- ICONS (as inline SVG components) ---
const ShoppingCartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const XIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Trash2Icon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

// --- CONTEXT for Global State Management ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home'); // home, product, cart, checkout, login, admin
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial products
  useEffect(() => {
    api.getProducts().then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const navigate = (pageName) => setPage(pageName);

  const viewProduct = (productId) => {
    setSelectedProductId(productId);
    navigate('product');
  };

  const addToCart = (productId, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { id: productId, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const loginUser = async (email, password) => {
    const userData = await api.login(email, password);
    setUser(userData);
    if (userData.isAdmin) {
      navigate('admin');
    } else {
      navigate('home');
    }
  };

  const logoutUser = () => {
    setUser(null);
    navigate('home');
  };
  
  const addProduct = (product) => {
    // TODO: In a real app, this would be an API call to the backend
    const newProduct = { ...product, id: Date.now(), rating: 0, stock: parseInt(product.stock, 10), price: parseFloat(product.price) };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };


  const value = {
    products,
    cart,
    user,
    page,
    selectedProductId,
    isLoading,
    navigate,
    viewProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    loginUser,
    logoutUser,
    addProduct,
    updateProduct,
    deleteProduct,
    setCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- COMPONENTS ---

const Header = () => {
  const { cart, user, navigate, logoutUser } = useContext(AppContext);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <a href="#" onClick={() => navigate('home')} className="text-2xl font-bold tracking-wider text-cyan-400">QuantumStore</a>
        </div>
        <div className="hidden md:block">
          {/* Main navigation links can go here */}
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('cart')} className="relative p-2 rounded-full hover:bg-slate-700 transition-colors">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <div className="relative">
             {user ? (
                <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline">{user.name}</span>
                    {user.isAdmin && <button onClick={() => navigate('admin')} className="p-2 rounded-full hover:bg-slate-700 transition-colors text-sm bg-cyan-600">Admin</button>}
                    <button onClick={logoutUser} className="p-2 rounded-full hover:bg-slate-700 transition-colors text-sm bg-slate-600">Logout</button>
                </div>
             ) : (
                <button onClick={() => navigate('login')} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                    <UserIcon className="h-6 w-6" />
                </button>
             )}
          </div>
        </div>
      </nav>
    </header>
  );
};

const ProductCard = ({ product }) => {
  const { viewProduct, addToCart } = useContext(AppContext);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
      <div className="relative pb-[75%]"> {/* 4:3 aspect ratio */}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute h-full w-full object-cover cursor-pointer" 
          onClick={() => viewProduct(product.id)}
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/ef4444/ffffff?text=Image+Failed'; }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-800 truncate">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-slate-600">{product.rating}</span>
          </div>
        </div>
        <div className="mt-4 flex-grow"></div> {/* Spacer */}
        <button
          onClick={() => addToCart(product.id)}
          className="w-full mt-4 bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductListPage = () => {
  const { products, isLoading } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1500);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(p => searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.price <= priceRange);

  if (isLoading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          {/* Price Filter */}
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-1 text-sm text-slate-600">Max Price: ${priceRange}</label>
            <input
              type="range"
              id="price"
              min="0"
              max="1500"
              step="10"
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 text-slate-500">
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

const ProductDetailPage = () => {
    const { products, selectedProductId, navigate, addToCart } = useContext(AppContext);
    const product = products.find(p => p.id === selectedProductId);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <button onClick={() => navigate('home')} className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600">
                    Back to Shop
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product.id, quantity);
        // Maybe show a confirmation message
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => navigate('home')} className="mb-6 text-cyan-600 hover:text-cyan-800">
                &larr; Back to all products
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full rounded-lg shadow-lg object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/ef4444/ffffff?text=Image+Failed'; }}
                    />
                </div>
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">{product.name}</h1>
                    <p className="text-md text-slate-500 mt-2">{product.category}</p>
                    <div className="flex items-center mt-4">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                            ))}
                        </div>
                        <span className="ml-2 text-slate-600">{product.rating} stars</span>
                    </div>
                    <p className="text-3xl font-light text-slate-900 my-4">${product.price.toFixed(2)}</p>
                    <p className="text-slate-600 leading-relaxed">{product.description}</p>
                    
                    <div className="mt-6 flex items-center space-x-4">
                        <div className="flex items-center border rounded-md">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-lg">-</button>
                            <span className="px-4 py-2">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-lg">+</button>
                        </div>
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-cyan-500 text-white py-3 px-6 rounded-md hover:bg-cyan-600 transition-colors text-lg"
                        >
                            Add to Cart
                        </button>
                    </div>
                    <p className="mt-4 text-green-600">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                </div>
            </div>
        </div>
    );
};

const CartPage = () => {
    const { cart, products, removeFromCart, updateCartQuantity, navigate } = useContext(AppContext);

    const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...product, ...item };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-700">Your cart is empty</h2>
                <button onClick={() => navigate('home')} className="mt-4 bg-cyan-500 text-white py-2 px-6 rounded-md hover:bg-cyan-600">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Your Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                                <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input 
                                    type="number" 
                                    value={item.quantity}
                                    onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 p-1 border rounded-md text-center"
                                    min="1"
                                />
                                <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2Icon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Taxes (8%)</span><span>${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                    <button onClick={() => navigate('checkout')} className="w-full mt-6 bg-cyan-500 text-white py-3 rounded-md hover:bg-cyan-600 text-lg font-semibold">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    const { cart, setCart, navigate, api } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');
        const formData = new FormData(e.target);
        const paymentDetails = Object.fromEntries(formData.entries());

        try {
            // In a real app, you would first create a PaymentIntent on your server.
            // Your server would then return a client_secret.
            // You would use that client_secret with the Stripe.js library to confirm the payment on the client-side.
            // Here, we just simulate the process.
            await api.processPayment(cart, paymentDetails);
            setSuccess(true);
            setCart([]); // Clear cart on successful payment
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    if (success) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="text-slate-600 mt-2">Thank you for your order. A confirmation has been sent to your email.</p>
                <button onClick={() => navigate('home')} className="mt-6 bg-cyan-500 text-white py-2 px-6 rounded-md hover:bg-cyan-600">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Checkout</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input name="name" type="text" placeholder="Full Name" className="w-full p-2 border rounded-md" required />
                            <input name="address" type="text" placeholder="Address" className="w-full p-2 border rounded-md" required />
                            <input name="city" type="text" placeholder="City" className="w-full p-2 border rounded-md" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="state" type="text" placeholder="State" className="w-full p-2 border rounded-md" required />
                                <input name="zip" type="text" placeholder="ZIP Code" className="w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                        <p className="text-sm text-slate-500 mb-2">This is a simulated payment form for demonstration.</p>
                        <div className="space-y-4">
                            <input name="cardName" type="text" placeholder="Name on Card" className="w-full p-2 border rounded-md" required />
                            <input name="cardNumber" type="text" placeholder="Card Number" className="w-full p-2 border rounded-md" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="expiry" type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md" required />
                                <input name="cvc" type="text" placeholder="CVC" className="w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button 
                        type="submit" 
                        disabled={isProcessing} 
                        className="w-full bg-cyan-500 text-white py-3 rounded-md hover:bg-cyan-600 text-lg font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const LoginPage = () => {
    const { loginUser } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await loginUser(email, password);
        setIsSubmitting(false);
    };

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl font-bold text-center mb-6 text-slate-700">Login</h1>
                    <p className="text-center text-sm text-slate-500 mb-4">Use <span className="font-mono bg-slate-100 p-1 rounded">admin@example.com</span> to access the admin panel.</p>
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-slate-400"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminPage = () => {
    const { products, addProduct, updateProduct, deleteProduct, user, navigate } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        // Redirect if not an admin
        if (!user || !user.isAdmin) {
            navigate('home');
        }
    }, [user, navigate]);

    const openModalForNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productData) => {
        if (editingProduct) {
            updateProduct({ ...editingProduct, ...productData });
        } else {
            addProduct(productData);
        }
        setIsModalOpen(false);
    };
    
    if (!user || !user.isAdmin) {
        return null; // or a loading/redirecting indicator
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Inventory Management</h1>
                <button onClick={openModalForNew} className="bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600">
                    Add New Product
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product Name</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Stock</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{product.name}</th>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openModalForEdit(product)} className="font-medium text-cyan-600 hover:underline">Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProductModal product={editingProduct} onSave={handleSaveProduct} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

const ProductModal = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        category: product?.category || 'Electronics',
        price: product?.price || '',
        stock: product?.stock || '',
        imageUrl: product?.imageUrl || '',
        description: product?.description || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">{product ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XIcon className="w-6 h-6"/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded-md" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded-md" rows="3" required />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md">
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Groceries</option>
                            <option>Clothing</option>
                        </select>
                        <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded-md" required />
                        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded-md" required />
                    </div>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded-md" />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 py-2 px-4 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

const MainContent = () => {
    const { page } = useContext(AppContext);

    const renderPage = () => {
        switch (page) {
            case 'home':
                return <ProductListPage />;
            case 'product':
                return <ProductDetailPage />;
            case 'cart':
                return <CartPage />;
            case 'checkout':
                return <CheckoutPage />;
            case 'login':
                return <LoginPage />;
            case 'admin':
                return <AdminPage />;
            default:
                return <ProductListPage />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans">
            <Header />
            <main>
                {renderPage()}
            </main>
            <footer className="bg-slate-800 text-white mt-12 py-6">
                <div className="container mx-auto text-center text-slate-400">
                    <p>&copy; 2025 QuantumStore. All rights reserved.</p>
                    <p className="text-sm mt-1">A React E-Commerce Demo</p>
                </div>
            </footer>
        </div>
    );
};