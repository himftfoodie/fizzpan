import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, FileText, User, Search, Heart, Bell, ShoppingCart, Package, Truck, CheckCircle, Clock, Star, MapPin, Phone, Mail, Menu, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import * as productService from '../../services/productService';
import * as orderService from '../../services/orderService';

// Bottom Navbar
const BottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'products', icon: ShoppingBag, label: 'Menu' },
    { id: 'orders', icon: FileText, label: 'Pesanan' },
    { id: 'account', icon: User, label: 'Akun' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-6 rounded-xl transition-all ${
              activeTab === item.id
                ? 'text-amber-800'
                : 'text-gray-400'
            }`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'stroke-2' : ''}`} />
            <span className={`text-xs font-medium ${activeTab === item.id ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Top Navigation Bar
const TopNav = ({ setActiveTab }) => {
  const auth = useAuth();
  const { user, signOut } = auth || {};
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-amber-900">🐟 Fizzpan</h1>
          <p className="text-xs text-gray-600">Japanese Taiyaki Shop</p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari taiyaki favorit..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Customer'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Halaman Home
const HomePage = ({ setActiveTab }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data.slice(0, 4)); // Show only 4 products on home
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-3">Selamat Datang di Fizzpan! 👋</h2>
            <p className="text-lg mb-6 opacity-90">Nikmati taiyaki autentik ala Jepang dengan berbagai varian rasa premium</p>
            <button 
              onClick={() => setActiveTab('products')}
              className="bg-white text-amber-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition">
              Pesan Sekarang →
            </button>
          </div>
          <div className="text-9xl ml-8">🐟</div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">🔥 Promo Spesial!</h3>
          <p className="mb-4">Beli 3 taiyaki dapat diskon 15%</p>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
            Lihat Detail
          </button>
        </div>
        <div className="bg-white rounded-xl p-6 border-2 border-amber-200">
          <h3 className="text-xl font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span>🇯🇵</span> Tentang Taiyaki
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Taiyaki adalah kue ikan tradisional Jepang yang dipanggang dengan berbagai isian lezat. 
            Di Fizzpan, kami menyajikan taiyaki fresh dengan resep autentik.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Menu Populer</h3>
          <button 
            onClick={() => setActiveTab('products')}
            className="text-amber-800 font-semibold hover:text-amber-900 flex items-center gap-1">
            Lihat Semua <span>→</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100">
              {product.isBestSeller && (
                <div className="bg-amber-800 text-white text-xs font-bold py-1.5 px-3 text-center">
                  ⭐ BEST SELLER
                </div>
              )}
              <div className="bg-amber-50 h-40 flex items-center justify-center text-8xl relative border-b border-gray-100">
                {product.image}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-1">{product.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{product.description || product.desc}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm text-gray-600 font-medium">{product.rating || '4.5'}</span>
                  <span className="text-xs text-gray-400">({product.sold || 0} terjual)</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-amber-800 font-bold text-lg">Rp {product.price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full mt-3 bg-amber-800 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-900 transition"
                >
                  + Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Kenapa Pilih Fizzpan?
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-800">Fresh Setiap Hari</p>
              <p className="text-sm text-gray-600">Dibuat langsung saat pesanan diterima</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-800">Resep Autentik</p>
              <p className="text-sm text-gray-600">Langsung dari Jepang</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-800">Bahan Premium</p>
              <p className="text-sm text-gray-600">Menggunakan bahan berkualitas terbaik</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-800">Pengiriman Cepat</p>
              <p className="text-sm text-gray-600">Aman dan tepat waktu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Halaman Products
const ProductsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredProducts = selectedFilter === 'all' 
    ? products 
    : products.filter(p => p.category === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">🐟 Menu Taiyaki</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              selectedFilter === 'all'
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua Menu
          </button>
          <button
            onClick={() => setSelectedFilter('sweet')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              selectedFilter === 'sweet'
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🍰 Rasa Manis
          </button>
          <button
            onClick={() => setSelectedFilter('savory')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              selectedFilter === 'savory'
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🧀 Rasa Gurih
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition border border-gray-100">
            <div className="relative">
              {product.isBestSeller && (
                <div className="absolute top-0 left-0 bg-amber-800 text-white text-xs font-bold py-2 px-4 rounded-br-xl z-10">
                  ⭐ BEST SELLER
                </div>
              )}
              <div className="bg-amber-50 h-48 flex items-center justify-center text-9xl border-b border-gray-100">
                {product.image}
              </div>
              <button className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md hover:bg-red-50 transition">
                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h4>
              <p className="text-sm text-gray-500 mb-3">{product.description || product.desc}</p>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-sm text-gray-600 font-medium">{product.rating || '4.5'}</span>
                <span className="text-sm text-gray-400 ml-auto">Stok: {product.stock || 'Available'}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-amber-800 font-bold text-xl">Rp {product.price.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => handleAddToCart(product.id)}
                className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 transition"
              >
                + Tambah ke Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Info */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-900 rounded-xl p-6 text-white">
        <h4 className="text-xl font-bold mb-2">🎉 Promo Spesial!</h4>
        <p className="text-lg">Beli 3 taiyaki dapat diskon 15% • Beli 5 gratis 1</p>
      </div>
    </div>
  );
};

// Halaman Orders
const OrdersPage = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const { user } = auth || {};

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const data = await orderService.getOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusConfig = (status) => {
    const configs = {
      delivered: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Terkirim' },
      shipping: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck, label: 'Dalam Pengiriman' },
      processing: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Package, label: 'Diproses' },
      pending: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock, label: 'Menunggu' },
    };
    return configs[status];
  };

  const filteredOrders = activeStatus === 'all' ? orders : orders.filter(o => o.status === activeStatus);

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Pesanan Saya</h2>
        <div className="flex gap-3">
          {['all', 'pending', 'processing', 'shipping', 'delivered'].map((status) => {
            const config = status !== 'all' ? getStatusConfig(status) : null;
            return (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  activeStatus === status
                    ? 'bg-amber-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Semua Pesanan' : config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Belum ada pesanan</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-xl text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.created_at || order.date).toLocaleDateString('id-ID')}
                  </p>
                  </div>
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border ${statusConfig.color}`}>
                    <StatusIcon className="w-5 h-5" />
                    {statusConfig.label}
                  </span>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-100">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">🐟</span>
                    <div className="flex-1">
                      {order.items?.map((item, idx) => (
                        <p key={idx} className="text-gray-700 font-medium">
                          {item.quantity}x {item.product?.name || 'Product'}
                        </p>
                      ))}
                      <p className="text-sm text-gray-500 mt-2">
                        {order.items?.length || 0} item
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                    <p className="font-bold text-amber-800 text-2xl">Rp {(order.total_amount || order.total || 0).toLocaleString()}</p>
                  </div>
                  <button className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Halaman Account
const AccountPage = () => {
  const auth = useAuth();
  const { user, signOut } = auth || {};
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: User, label: 'Edit Profil', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Heart, label: 'Wishlist Saya', color: 'text-red-600', bg: 'bg-red-50', badge: '3' },
    { icon: FileText, label: 'Riwayat Pesanan', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Bell, label: 'Notifikasi', color: 'text-yellow-600', bg: 'bg-yellow-50', badge: '2' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-amber-800 text-4xl font-bold shadow-xl">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{user?.username || 'User'}</h2>
            <p className="text-lg opacity-90 mb-1">{user?.email || 'user@example.com'}</p>
          </div>
          <button className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
            Edit Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Statistik</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Pesanan</span>
              <span className="text-2xl font-bold text-amber-800">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Wishlist</span>
              <span className="text-2xl font-bold text-amber-800">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Poin Loyalty</span>
              <span className="text-2xl font-bold text-amber-800">12</span>
            </div>
          </div>
        </div>

        {/* Loyalty Card */}
        <div className="col-span-2 bg-gradient-to-r from-amber-800 to-amber-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold mb-2">🎁 Kartu Loyalitas</h4>
              <p className="opacity-90">Beli 10 taiyaki gratis 1!</p>
            </div>
            <span className="bg-white text-amber-800 text-lg font-bold px-4 py-2 rounded-xl">8/10</span>
          </div>
          <div className="flex gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`flex-1 h-3 rounded-full ${i < 8 ? 'bg-white' : 'bg-white/30'}`}></div>
            ))}
          </div>
          <p className="text-sm mt-4 opacity-90">Tinggal 2 lagi untuk mendapatkan taiyaki gratis! 🎉</p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <button key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-4 ${item.bg} rounded-xl ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-gray-800 text-lg">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.badge && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
              <span className="text-gray-400 text-xl">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h4 className="font-bold text-amber-900 text-xl mb-4 flex items-center gap-2">
          <Phone className="w-6 h-6" />
          Hubungi Kami
        </h4>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">WhatsApp</p>
              <p className="font-semibold text-gray-800">0812-3456-7890</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Lokasi</p>
              <p className="font-semibold text-gray-800">Bekasi, West Java</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-50 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Jam Buka</p>
              <p className="font-semibold text-gray-800">09.00 - 21.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-100 transition border-2 border-red-100"
        >
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
};

// Halaman Cart
const CartPage = ({ setActiveTab }) => {
  const { cart, cartTotal, loading, removeFromCart, updateCartItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartId, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeFromCart(cartId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">🛒 Keranjang Belanja</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Keranjang belanja kosong</p>
            <button 
              onClick={() => setActiveTab('products')}
              className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-amber-100 rounded-lg flex items-center justify-center text-3xl">
                    🐟
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{item.product.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{item.product.description || item.product.desc}</p>
                    <p className="text-amber-800 font-bold">Rp {item.product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-amber-800">Rp {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => clearCart()}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Kosongkan Keranjang
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main Component
export default function FizzpanApp() {
  const [activeTab, setActiveTab] = useState('home');

  const renderPage = () => {
    switch(activeTab) {
      case 'home': return <HomePage setActiveTab={setActiveTab} />;
      case 'products': return <ProductsPage />;
      case 'cart': return <CartPage setActiveTab={setActiveTab} />;
      case 'orders': return <OrdersPage />;
      case 'account': return <AccountPage />;
      default: return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <TopNav setActiveTab={setActiveTab} />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}