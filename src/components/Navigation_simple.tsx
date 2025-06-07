'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, ShoppingCart, Radio, Play, Trophy } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'HOME', icon: Home },
    { href: '/shop', label: 'SHOP', icon: ShoppingCart },
    { href: '/live', label: 'LIVE', icon: Radio },
    { href: '/documentary', label: 'VIDEOS', icon: Play },
    { href: '/loyalty', label: 'SHERIFF THIZZ', icon: Trophy },
  ];

  return (
    <nav className="strange-nav sticky top-0 z-50 py-4">
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
                  pathname === href ? 'active' : ''
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
                pathname === href ? 'text-red-600 border-l-2 border-red-600 pl-3' : 'text-white'
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
