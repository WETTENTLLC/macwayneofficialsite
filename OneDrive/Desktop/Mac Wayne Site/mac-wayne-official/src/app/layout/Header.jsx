import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../strange-theme.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`strange-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/Images/macwayne-logo.png" alt="Mac Wayne" className="strange-logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="strange-nav-item">Home</Link>
            <Link to="/music" className="strange-nav-item">Music</Link>
            <Link to="/videos" className="strange-nav-item">Videos</Link>
            <Link to="/tour" className="strange-nav-item">Tour</Link>
            <Link to="/merch" className="strange-nav-item">Merch</Link>
            <Link to="/about" className="strange-nav-item">About</Link>
            <Link to="/contact" className="strange-nav-item">Contact</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white"
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
          <nav className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/music" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>Music</Link>
              <Link to="/videos" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>Videos</Link>
              <Link to="/tour" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>Tour</Link>
              <Link to="/merch" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>Merch</Link>
              <Link to="/about" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="strange-nav-item" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
