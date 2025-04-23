import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-red-lotus text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Red Lotus</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-lotus transition">Home</Link>
            <Link to="/music" className="hover:text-yellow-lotus transition">Music</Link>
            <Link to="/vibration" className="hover:text-yellow-lotus transition">Vibration</Link>
            <Link to="/gallery" className="hover:text-yellow-lotus transition">Gallery</Link>
            <Link to="/contact" className="hover:text-yellow-lotus transition">Contact</Link>
            
            {/* Show Admin link only if authenticated */}
            {currentUser && (
              <Link 
                to="/admin" 
                className="ml-4 px-4 py-1 bg-yellow-lotus text-red-lotus rounded-md hover:bg-opacity-90 transition"
              >
                Admin
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link to="/" className="block py-2 hover:text-yellow-lotus transition">Home</Link>
            <Link to="/music" className="block py-2 hover:text-yellow-lotus transition">Music</Link>
            <Link to="/vibration" className="block py-2 hover:text-yellow-lotus transition">Vibration</Link>
            <Link to="/gallery" className="block py-2 hover:text-yellow-lotus transition">Gallery</Link>
            <Link to="/contact" className="block py-2 hover:text-yellow-lotus transition">Contact</Link>
            
            {/* Show Admin link only if authenticated */}
            {currentUser && (
              <Link 
                to="/admin" 
                className="block py-2 text-yellow-lotus font-medium"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
