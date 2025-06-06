'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, ShoppingCart, Radio, Play } from 'lucide-react';

interface NavigationProps {
  currentPath?: string;
}

export default function EnhancedNavigation({ currentPath }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Use the provided currentPath or the pathname from Next.js
  const activePath = currentPath || pathname || '/';

  // Listen for scroll events to add styling when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/shop', label: 'SHOP', icon: ShoppingCart },
    { href: '/live', label: 'LIVE', icon: Radio },
    { href: '/documentary', label: 'VIDEOS', icon: Play },
  ];

  return (
    <nav className={`strange-nav sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg' : 'py-4'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="strange-logo-text text-2xl text-white hover:text-red-600 transition-colors">
            MAC WAYNE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`strange-nav-item ${
                  activePath === href ? 'active' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-black/95 border-t border-red-900`}>
        <div className="px-4 py-2 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`strange-nav-mobile-item flex items-center space-x-3 py-3 px-2 ${
                activePath === href ? 'text-red-600 border-l-2 border-red-600 pl-3' : 'text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={20} />
              <span className="font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
