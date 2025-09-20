// src/components/Navbar.jsx - Beautiful modern design
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Don't show navbar on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <span className="text-white text-xl">🍬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                Sweet Shop
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Management System</p>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/dashboard') || isActive('/')
                    ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">{user.name || user.email}</p>
                  <div className="flex justify-end">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'ROLE_ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                </div>

                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium transition-colors duration-200 hover:shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-violet-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}