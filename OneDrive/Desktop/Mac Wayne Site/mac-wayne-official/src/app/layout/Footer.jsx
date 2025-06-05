import React from 'react';
import { Link } from 'react-router-dom';
import '../strange-theme.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="strange-footer">
      <div className="barbed-wire mb-8"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/">
              <img src="/Images/macwayne-logo.JPG" alt="Mac Wayne" className="strange-logo mx-auto md:mx-0 mb-4" style={{maxWidth: '180px'}} />
            </Link>
            <p className="text-gray-400 text-sm text-center md:text-left">
              Official website of Mac Wayne. Strange music inspired artist bringing you authentic hip-hop music.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">Links</h3>
            <ul className="space-y-2 text-center md:text-left">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/music" className="text-gray-400 hover:text-white transition">Music</Link></li>
              <li><Link to="/videos" className="text-gray-400 hover:text-white transition">Videos</Link></li>
              <li><Link to="/tour" className="text-gray-400 hover:text-white transition">Tour</Link></li>
              <li><Link to="/merch" className="text-gray-400 hover:text-white transition">Merch</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">Connect</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
              <a href="https://apple.com/music" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.073 4.043.138 3.34.32 2.004.723.89 1.62.43 2.934c-.022.062-.04.125-.06.187-.15.5-.22 1.017-.25 1.54-.08.146-.016.29-.02.428v14.076c.004.15.01.3.02.448.03.51.1 1.01.25 1.5.02.06.038.12.058.18.46 1.315 1.572 2.212 2.91 2.616.807.208 1.644.278 2.488.3.14.01.28.016.42.02h12.022c.14-.004.28-.01.42-.02.76-.022 1.504-.078 2.214-.24 1.314-.317 2.318-1.07 3.043-2.2.263-.39.47-.803.586-1.26.147-.548.193-1.114.21-1.68.01-.076.01-.156.01-.24V6.124zm-2.54 9.138c-.02.097-.042.19-.063.28-.08.354-.175.625-.28.814-.188.307-.566.57-1.03.7-.5.13-1.227.198-2.096.198H5.97c-.977 0-1.733-.052-2.24-.2-.47-.142-.79-.45-.93-.726-.14-.29-.22-.554-.22-.905V7.88c0-.346.083-.666.33-.978.4-.53 1.02-.63 1.73-.65.14-.005.275-.01.41-.01H18.57c.19 0 .39.004.574.01.88.01 1.702.104 2.106.454.39.343.475.795.476 1.07 0 .03.002.06.002.09v6.16c-.002.178-.006.358-.022.54z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">Contact</h3>
            <address className="not-italic text-gray-400 text-center md:text-left">
              <p>Email: <a href="mailto:info@macwayne.com" className="hover:text-white">info@macwayne.com</a></p>
              <p className="mt-2">For bookings: <a href="mailto:bookings@macwayne.com" className="hover:text-white">bookings@macwayne.com</a></p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Mac Wayne. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
