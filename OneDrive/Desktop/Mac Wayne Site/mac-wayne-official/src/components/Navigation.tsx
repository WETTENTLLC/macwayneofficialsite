'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, ShoppingCart, Radio, Play, Eye, EyeOff, Volume2, Mic, User, LogOut, Trophy } from 'lucide-react';
import VoiceCommands from './VoiceCommands';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPath?: string;
}

export default function Navigation({ currentPath = '/' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isBrailleMode, setIsBrailleMode] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: ShoppingCart },
    { href: '/live', label: 'Help the Blind Man', icon: Radio },
    { href: '/documentary', label: 'Documentary', icon: Play },
    { href: '/loyalty', label: 'Sheriff Thizz', icon: Trophy },
  ];

  const toggleAccessibility = (mode: 'contrast' | 'braille') => {
    if (mode === 'contrast') {
      setIsHighContrast(!isHighContrast);
      document.body.classList.toggle('high-contrast');
    } else {
      setIsBrailleMode(!isBrailleMode);
      document.body.classList.toggle('braille-mode');
    }
  };

  const handleVoiceNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-black border-b-2 border-orange-500 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="bebas-header text-2xl text-white hover:text-orange-500 transition-colors">
              MAC WAYNE OFFICIAL
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-2 transition-colors ${
                    currentPath === href
                      ? 'text-orange-500'
                      : 'text-white hover:text-orange-500'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{label}</span>
                </Link>
              ))}
            </div>            {/* Accessibility Controls */}
            <div className="hidden md:flex items-center space-x-2">
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-orange-500 text-white hover:bg-orange-600 rounded transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowVoiceCommands(!showVoiceCommands)}
                className={`p-2 rounded-full transition-colors ${
                  showVoiceCommands ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                aria-label="Toggle Voice Commands"
                title="Voice Commands"
              >
                <Mic size={20} />
              </button>
              <button
                onClick={() => toggleAccessibility('contrast')}
                className={`p-2 rounded-full transition-colors ${
                  isHighContrast ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                aria-label="Toggle High Contrast"
                title="High Contrast Mode"
              >
                {isHighContrast ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                onClick={() => toggleAccessibility('braille')}
                className={`p-2 rounded-full transition-colors ${
                  isBrailleMode ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                aria-label="Toggle Braille Mode"
                title="Braille Mode"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white hover:text-orange-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="space-y-4">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 py-2 transition-colors ${
                      currentPath === href
                        ? 'text-orange-500'
                        : 'text-white hover:text-orange-500'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{label}</span>
                  </Link>                ))}
                
                {/* Mobile User Authentication */}
                <div className="pt-4 border-t border-gray-700">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="text-white">Welcome, {user?.name}</div>
                      {user?.isDeputyMember && (
                        <div className="text-orange-500 text-sm">Deputy Member</div>
                      )}
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white py-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setShowAuthModal(true);
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white py-2"
                      >
                        <User size={16} />
                        <span>Sign In</span>
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          setShowAuthModal(true);
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded"
                      >
                        <User size={16} />
                        <span>Sign Up</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Mobile Accessibility Controls */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowVoiceCommands(!showVoiceCommands)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      showVoiceCommands ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Mic size={16} />
                    <span className="text-sm">Voice</span>
                  </button>
                  <button
                    onClick={() => toggleAccessibility('contrast')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isHighContrast ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {isHighContrast ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="text-sm">Contrast</span>
                  </button>
                  <button
                    onClick={() => toggleAccessibility('braille')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isBrailleMode ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Volume2 size={16} />
                    <span className="text-sm">Braille</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>      {/* Voice Commands Panel */}
      {showVoiceCommands && (
        <div className="fixed top-20 right-4 z-40 w-80 max-w-[90vw]">
          <VoiceCommands 
            onNavigate={handleVoiceNavigation}
            className="shadow-2xl"
          />
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
}
