import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Menu,
  X,
  Users,
  Utensils,
  ShoppingBag,
  List,
  LogOut,
  ChefHat,
  TrendingUp,
  Package,
  ClipboardList
} from "lucide-react";
import UseLoader from "../../components/loader/UseLoader.jsx";
import CartComponent from "../../components/CartComponent.jsx";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [loader, showLoader, hideLoader] = UseLoader();
  const [activeItem, setActiveItem] = useState(1);
  const isScreenSmall = useMediaQuery("(max-width:1280px)");
  const navigate = useNavigate();
  const auth = useAuth();
  const { signOut } = auth || {};

  const handleModalToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(!isScreenSmall);
  }, [isScreenSmall]);

  const handleListItemClick = (index, path) => {
    setActiveItem(index);
    if (isScreenSmall) {
      handleModalToggle();
    }
  };

  const logout = async () => {
    try {
      showLoader();
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/login");
    } finally {
      hideLoader();
    }
  };

  const menuItems = [
    { id: 1, icon: Users, label: "Users", path: "", description: "Manage user profiles" },
    { id: 2, icon: Utensils, label: "Products", path: "food-list", description: "Manage food menu" },
    { id: 3, icon: ClipboardList, label: "Orders", path: "all-orders-list", description: "View all orders" },
    { id: 4, icon: Package, label: "Order Items", path: "order-list", description: "Order details" },
    { id: 5, icon: ShoppingBag, label: "Carts", path: "cart-list", description: "Active shopping carts" },
    { id: 6, icon: TrendingUp, label: "Revenue", path: "revenue", description: "Income reports" },
  ];

  return (
    <>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col ${
            open ? "w-64" : "-translate-x-full"
          } ${isScreenSmall ? "shadow-xl" : ""}`}
        >
          {/* Sidebar Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200"
              style={{ backgroundColor: '#58321A' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#B8804A' }}>
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Fizzpan</h2>
                <p className="text-xs text-gray-300">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => handleListItemClick(item.id, item.path)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-white font-semibold shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={isActive ? { backgroundColor: '#A1887F' } : {}}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <span className="text-sm block">{item.label}</span>
                        {!isActive && (
                          <span className="text-xs text-gray-500 group-hover:text-gray-600">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* User Info - Paling bawah */}
          {/* <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#A1887F' }}>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@fizzpan.com</p>
              </div>
            </div>
          </div> */}


        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            open && !isScreenSmall ? "ml-64" : "ml-0"
          }`}
        >
          {/* Top Navbar */}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={handleModalToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#B8804A' }}>
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Fizzpan Dashboard</h1>
                  <p className="text-xs text-gray-500">Restaurant Management System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: '#A1887F' }}>
                <Users className="w-4 h-4" />
                <span>Admin</span>
              </div>
              <CartComponent />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>

        {/* Overlay for mobile */}
        {open && isScreenSmall && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={handleModalToggle}
          />
        )}
      </div>
      {loader}
    </>
  );
}
