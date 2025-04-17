import { useState, useEffect } from 'react';
import BandAuditionForm from './components/BandAuditionForm';
// Keep type import static
import type { UploadOptions } from '@vercel/blob/client';

// Import all image assets properly
import lotusForEachAlbum from './assets/lotus-for-each-album.png';
import redLotusAlbumRap from './assets/red-lotus-album-rap.jpeg';
import yellowLotusAlbumPop from './assets/yellow-lotus-album-pop.jpeg'; 
import blueLotusAlbumRnb from './assets/blue-lotus-album-rnb.jpeg';
import redLotusImage from './assets/red-lotus-image.png';
import yellowLotusImage from './assets/yellow-lotus-image.png';
import blueLotusImage from './assets/blue-lotus-image.png';
import brownLotusImage from './assets/brown-lotus-image.png';
import pinkLotusImage from './assets/pink-lotus-image.png';
import behindTheScenesMain from './assets/behind-the-scenes-main-image.jpeg';
import behindTheScenes2 from './assets/behind-the-scenes-image2.jpeg';
import behindTheScenes3 from './assets/behind-the-scenes-image3.jpeg';
import artistMain from './assets/artist-image-main.jpeg';
import artistImage1 from './assets/aritst-image1.jpeg';
import artistImage2 from './assets/artist-image2.jpeg';
import artistImage3 from './assets/artist-image3.jpeg';
import artistImage4 from './assets/artist-image4.jpeg';

// Define the possible theme names as a type
type ThemeName = 'red' | 'yellow' | 'blue' | 'green' | 'brown' | 'pink';

// Add new types for music uploads and purchases
type UploadedMusic = {
  id: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  albumArtUrl?: string;
  attachments?: { name: string; url: string }[];
  purchaseCount: number;
  clickCount: number;
  isAlbum?: boolean;
  tracks?: UploadedMusic[];
};

function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>('red');
  const [activeSection, setActiveSection] = useState<string>('main');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showAuditionWidget, setShowAuditionWidget] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState<UploadedMusic[]>([]);

  // Define theme colors mapping for easier access
  const themeColors: Record<ThemeName, string> = {
    red: 'bg-red-lotus',
    yellow: 'bg-yellow-lotus',
    blue: 'bg-blue-lotus',
    green: 'bg-green-lotus',
    brown: 'bg-brown-lotus',
    pink: 'bg-pink-lotus',
  };

  // Define theme text colors if needed
  const themeTextColors: Record<ThemeName, string> = {
    red: 'text-white',
    yellow: 'text-black', 
    blue: 'text-white',
    green: 'text-white',
    brown: 'text-white',
    pink: 'text-white',
  };

  const handleThemeChange = (theme: ThemeName) => {
    setActiveTheme(theme);
    const section = document.getElementById(theme);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top on section change for better UX
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMusicUpload = (music: Omit<UploadedMusic, 'id' | 'purchaseCount' | 'clickCount'>) => {
    setUploadedMusic(prev => [
      ...prev,
      {
        ...music,
        id: Math.random().toString(36).slice(2),
        purchaseCount: 0,
        clickCount: 0,
      }
    ]);
  };

  const handleMusicClick = (id: string) => {
    setUploadedMusic(prev =>
      prev.map(m => m.id === id ? { ...m, clickCount: m.clickCount + 1 } : m)
    );
  };

  const handleMusicPurchase = (id: string) => {
    setUploadedMusic(prev =>
      prev.map(m => m.id === id ? { ...m, purchaseCount: m.purchaseCount + 1 } : m)
    );
    alert('Thank you for your purchase! (Square payment integration goes here)');
  };

  // Determine dynamic background and text color for header/footer
  const headerFooterBg = themeColors[activeTheme] || 'bg-gray-800';
  const headerFooterText = themeTextColors[activeTheme] || 'text-white';

  // Set document title with useEffect
  useEffect(() => {
    document.title = 'Red Lotus | Official Site';
  }, []);

  function handleBandAuditionSubmit() {
    // Placeholder for band audition form submission logic
    alert('Band audition submitted!');
  }

  return (
    <>
      <div className={`min-h-screen ${themeTextColors[activeTheme] || 'text-white'} transition-colors duration-300 ease-in-out`}>
        {/* Header with Navigation */}
        <header className={`p-4 ${headerFooterBg} sticky top-0 z-10 transition-colors duration-300 ease-in-out`}>
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold" aria-label="Red Lotus Home">Red Lotus</h1>
            
            {/* Main Navigation */}
            <nav className="flex space-x-6 mx-auto bg-black/70 px-6 py-2 rounded-full">
              <button 
                onClick={() => handleSectionChange('main')}
                className={`px-3 py-1 rounded-md ${activeSection === 'main' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                HUT
              </button>
              <button 
                onClick={() => handleSectionChange('music')}
                className={`px-3 py-1 rounded-md ${activeSection === 'music' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                MUSIC
              </button>
              <button 
                onClick={() => handleSectionChange('vibes')}
                className={`px-3 py-1 rounded-md ${activeSection === 'vibes' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                VIBRATE
              </button>
              <button 
                onClick={() => handleSectionChange('community')}
                className={`px-3 py-1 rounded-md ${activeSection === 'community' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                TRIBE
              </button>
              <button 
                onClick={() => handleSectionChange('behind-scenes')}
                className={`px-3 py-1 rounded-md ${activeSection === 'behind-scenes' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                BTS
              </button>
              <button 
                onClick={() => handleSectionChange('music-store')}
                className={`px-3 py-1 rounded-md ${activeSection === 'music-store' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                STORE
              </button>
            </nav>
            
            {/* Theme switcher buttons - Using album art with lotus overlay */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleThemeChange('red')}
                className="relative w-12 h-12 rounded-full overflow-hidden border border-white/50 focus:outline-none"
                aria-label="Switch to Red theme (Rap)"
              >
                <img src={redLotusAlbumRap} alt="Red Album" className="absolute inset-0 w-full h-full object-cover" />
                <img src={lotusForEachAlbum} alt="Transparent Lotus" className="absolute inset-0 w-full h-full object-contain" />
              </button>
              <button
                onClick={() => handleThemeChange('yellow')}
                className="relative w-12 h-12 rounded-full overflow-hidden border border-white/50 focus:outline-none"
                aria-label="Switch to Yellow theme (Pop)"
              >
                <img src={yellowLotusAlbumPop} alt="Yellow Album" className="absolute inset-0 w-full h-full object-cover" />
                <img src={lotusForEachAlbum} alt="Transparent Lotus" className="absolute inset-0 w-full h-full object-contain" />
              </button>
              <button
                onClick={() => handleThemeChange('blue')}
                className="relative w-12 h-12 rounded-full overflow-hidden border border-white/50 focus:outline-none"
                aria-label="Switch to Blue theme (R&B)"
              >
                <img src={blueLotusAlbumRnb} alt="Blue Album" className="absolute inset-0 w-full h-full object-cover" />
                <img src={lotusForEachAlbum} alt="Transparent Lotus" className="absolute inset-0 w-full h-full object-contain" />
              </button>
              {/* Admin button */}
              <button
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                className="ml-2 px-2 py-1 text-xs bg-gray-900/50 hover:bg-gray-900/70 rounded-md border border-white/20"
              >
                {showAdminDashboard ? 'Exit Admin' : 'Admin'}
              </button>
            </div>
          </div>
        </header>

        {/* Admin Dashboard */}
        {showAdminDashboard && (
          <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
            <div className="container mx-auto py-12 px-4">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
                  <button 
                    onClick={() => setShowAdminDashboard(false)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white"
                  >
                    Close
                  </button>
                </div>
                
                {/* Content Management Tabs */}
                <div className="mb-8">
                  <div className="flex border-b border-gray-700 overflow-x-auto">
                    <button 
                      onClick={() => setActiveTab('content')}
                      className={`px-4 py-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}>
                      Content
                    </button>
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className={`px-4 py-2 ${activeTab === 'messages' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}>
                      Messages
                    </button>
                    <button 
                      onClick={() => setActiveTab('community')}
                      className={`px-4 py-2 ${activeTab === 'community' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}>
                      Community
                    </button>
                    <button 
                      onClick={() => setActiveTab('statistics')}
                      className={`px-4 py-2 ${activeTab === 'statistics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}>
                      Statistics
                    </button>
                    <button 
                      onClick={() => setActiveTab('music-upload')}
                      className={`px-4 py-2 ${activeTab === 'music-upload' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-white'}`}>
                      Music Upload
                    </button>
                  </div>
                </div>
                
                {/* Music Upload Tab */}
                {activeTab === 'music-upload' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Upload Music or Album</h3>
                    <MusicUploadForm onUpload={handleMusicUpload} /> 
                    <div className="mt-8">
                      <h4 className="text-lg font-bold text-white mb-2">Uploaded Music</h4>
                      <ul className="space-y-4">
                        {uploadedMusic.map(music => (
                          <li key={music.id} className="bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center space-x-4">
                              {music.albumArtUrl && (
                                <img src={music.albumArtUrl} alt="Album Art" className="w-16 h-16 object-cover rounded" />
                              )}
                              <div>
                                <div className="font-bold text-white">{music.title}</div>
                                <div className="text-gray-300 text-sm">{music.description}</div>
                                <div className="text-yellow-lotus font-semibold">${music.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="mt-2 md:mt-0 flex flex-col items-end">
                              <span className="text-xs text-gray-300">Purchases: {music.purchaseCount}</span>
                              <span className="text-xs text-gray-300">Clicks: {music.clickCount}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main>
          {/* Main Landing Section */}
          <section id="main" className={activeSection === 'main' ? 'block' : 'hidden'}>
            <div className="h-screen flex items-center justify-center relative bg-black">
              <img src={lotusForEachAlbum} alt="Red Lotus Logo" className="absolute inset-0 w-full h-full object-contain opacity-20" />
              <div className="text-center z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">Red Lotus</h1>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handleSectionChange('music')}
                    className="px-6 py-3 bg-red-lotus hover:bg-red-700 rounded-full text-white font-medium transition-colors"
                  >
                    Explore
                  </button>
                  <button 
                    onClick={() => handleSectionChange('vibes')}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 backdrop-blur-sm rounded-full text-white font-medium transition-colors"
                  >
                    Vibrate
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Music Section */}
          <section id="music" className={activeSection === 'music' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-red-lotus to-black py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-8 text-center text-white">Red Lotus Music</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center">
                    <img src={redLotusAlbumRap} alt="Red Lotus Album" className="w-40 h-40 object-cover rounded mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Red Lotus (Rap)</h3>
                    <p className="text-gray-300 mb-2">Hard-hitting rap tracks for the winter season.</p>
                    <a href="https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/" target="_blank" rel="noopener noreferrer" className="bg-red-lotus text-white px-4 py-2 rounded-full font-bold">Stream</a>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center">
                    <img src={yellowLotusAlbumPop} alt="Yellow Lotus Album" className="w-40 h-40 object-cover rounded mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Yellow Lotus (Pop)</h3>
                    <p className="text-gray-300 mb-2">Uplifting pop tracks for the summer season.</p>
                    <a href="#" className="bg-yellow-lotus text-black px-4 py-2 rounded-full font-bold">Coming Soon</a>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center">
                    <img src={blueLotusAlbumRnb} alt="Blue Lotus Album" className="w-40 h-40 object-cover rounded mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Blue Lotus (R&B)</h3>
                    <p className="text-gray-300 mb-2">Smooth R&B tracks for the spring season.</p>
                    <a href="#" className="bg-blue-lotus text-white px-4 py-2 rounded-full font-bold">Coming Soon</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vibes Section - EXACT ORIGINAL LAYOUT */}
          <section id="vibes" className={activeSection === 'vibes' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-yellow-lotus to-black py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8 text-black">Find Your Vibe</h2>
                <p className="text-lg text-black mb-6">Explore music for every mood and season. Red Lotus brings you a unique blend of genres and themes to match your energy.</p>
                
                {/* Grid of all lotus images representing different vibes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {/* Red Lotus */}
                  <div className="bg-black/20 rounded-xl p-6 flex flex-col items-center">
                    <img src={redLotusImage} alt="Red Lotus" className="w-40 h-40 object-contain rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">Red Vibe</h3>
                    <p className="text-black mb-2">Winter energy and focused motivation. For those moments of intensity and drive.</p>
                  </div>
                  
                  {/* Yellow Lotus */}
                  <div className="bg-black/20 rounded-xl p-6 flex flex-col items-center">
                    <img src={yellowLotusImage} alt="Yellow Lotus" className="w-40 h-40 object-contain rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">Yellow Vibe</h3>
                    <p className="text-black mb-2">Summer energy and uplifting positivity. For your brightest and most joyful moments.</p>
                  </div>
                  
                  {/* Blue Lotus */}
                  <div className="bg-black/20 rounded-xl p-6 flex flex-col items-center">
                    <img src={blueLotusImage} alt="Blue Lotus" className="w-40 h-40 object-contain rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">Blue Vibe</h3>
                    <p className="text-black mb-2">Spring renewal and calm reflection. Perfect for thoughtful, peaceful times.</p>
                  </div>
                  
                  {/* Brown Lotus */}
                  <div className="bg-black/20 rounded-xl p-6 flex flex-col items-center">
                    <img src={brownLotusImage} alt="Brown Lotus" className="w-40 h-40 object-contain rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">Brown Vibe</h3>
                    <p className="text-black mb-2">Autumn grounding and earthy connection. For stability and natural harmony.</p>
                  </div>
                  
                  {/* Pink Lotus */}
                  <div className="bg-black/20 rounded-xl p-6 flex flex-col items-center">
                    <img src={pinkLotusImage} alt="Pink Lotus" className="w-40 h-40 object-contain rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">Pink Vibe</h3>
                    <p className="text-black mb-2">Love energy and emotional connection. For romantic and heartfelt expression.</p>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-4 text-black">Coming Soon</h3>
                  <p className="text-black mb-6">Performance videos and special content for each vibe.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Community/Tribe Section */}
          <section id="community" className={activeSection === 'community' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-blue-lotus to-black py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8 text-white">Join the Tribe</h2>
                <p className="text-lg text-white mb-6">Become part of the Red Lotus community. Get exclusive content, early access, and connect with other fans.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="p-4">
                    <img src={redLotusImage} alt="Red Lotus Tribe" className="rounded-lg shadow-lg mx-auto mb-4 w-40 h-40 object-contain" />
                    <h3 className="text-xl font-bold">Red Tribe</h3>
                    <p>Winter energy and focused motivation</p>
                  </div>
                  <div className="p-4">
                    <img src={yellowLotusImage} alt="Yellow Lotus Tribe" className="rounded-lg shadow-lg mx-auto mb-4 w-40 h-40 object-contain" />
                    <h3 className="text-xl font-bold">Yellow Tribe</h3>
                    <p>Summer vibes and uplifting energy</p>
                  </div>
                  <div className="p-4">
                    <img src={blueLotusImage} alt="Blue Lotus Tribe" className="rounded-lg shadow-lg mx-auto mb-4 w-40 h-40 object-contain" />
                    <h3 className="text-xl font-bold">Blue Tribe</h3>
                    <p>Spring renewal and flowing creativity</p>
                  </div>
                </div>
                <a href="#" className="bg-blue-lotus text-white px-6 py-3 rounded-full font-bold">Sign Up Coming Soon</a>
              </div>
            </div>
          </section>

          {/* Behind the Scenes Section */}
          <section id="behind-scenes" className={activeSection === 'behind-scenes' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8 text-white">Behind the Scenes</h2>
                <p className="text-lg text-white mb-6">Get an exclusive look at the creative process and studio moments.</p>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                  <img src={behindTheScenesMain} alt="Behind the Scenes Main" className="w-64 h-40 object-cover rounded-lg shadow-lg" />
                  <img src={behindTheScenes2} alt="Behind the Scenes 2" className="w-64 h-40 object-cover rounded-lg shadow-lg" />
                  <img src={behindTheScenes3} alt="Behind the Scenes 3" className="w-64 h-40 object-cover rounded-lg shadow-lg" />
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-4 text-white">Meet the Artist</h3>
                  <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    <img src={artistMain} alt="Artist Main" className="w-64 h-64 object-cover rounded-full shadow-lg" />
                  </div>
                  <div className="flex flex-row gap-4 justify-center mt-8">
                    <img src={artistImage1} alt="Artist Image 1" className="w-20 h-20 object-cover rounded-full shadow-lg" />
                    <img src={artistImage2} alt="Artist Image 2" className="w-20 h-20 object-cover rounded-full shadow-lg" />
                    <img src={artistImage3} alt="Artist Image 3" className="w-20 h-20 object-cover rounded-full shadow-lg" />
                    <img src={artistImage4} alt="Artist Image 4" className="w-20 h-20 object-cover rounded-full shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Music Store Section */}
          <section id="music-store" className={activeSection === 'music-store' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-8 text-center text-white">Music Store</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {uploadedMusic.length > 0 ? (
                    uploadedMusic.map(music => (
                      <div key={music.id} className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
                        {music.albumArtUrl && (
                          <img src={music.albumArtUrl} alt="Album Art" className="w-full h-48 object-cover rounded mb-4" />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{music.title}</h3>
                          <p className="text-gray-300 mb-2">{music.description}</p>
                          <div className="text-yellow-lotus font-semibold mb-2">${music.price.toFixed(2)}</div>
                        </div>
                        <button
                          className="mt-2 px-4 py-2 bg-yellow-lotus text-black font-bold rounded hover:bg-yellow-400 transition"
                          onClick={() => {
                            handleMusicClick(music.id);
                            handleMusicPurchase(music.id);
                          }}
                        >
                          Buy Now
                        </button>
                        <span className="mt-2 text-xs text-gray-400">Purchases: {music.purchaseCount} | Clicks: {music.clickCount}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center p-12">
                      <p className="text-gray-400 mb-4">No music available yet. Check back soon!</p>
                      <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center mx-auto max-w-md">
                        <img src={redLotusAlbumRap} alt="Red Lotus Album" className="w-40 h-40 object-cover rounded mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Red Lotus (Rap)</h3>
                        <p className="text-gray-300 mb-2">Available on music streaming platforms.</p>
                        <a href="https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/" target="_blank" rel="noopener noreferrer" className="bg-red-lotus text-white px-4 py-2 rounded-full font-bold">Stream Now</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className={`p-6 ${headerFooterBg} text-center transition-colors duration-300 ease-in-out ${headerFooterText}`}>
          <div className="container mx-auto">
            <img src={lotusForEachAlbum} alt="Red Lotus Logo" className="w-12 h-12 mx-auto mb-4" />
            <p className="mb-2">© {new Date().getFullYear()} Red Lotus Music. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity" aria-label="Stream Red Lotus Album">Stream</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Band Auditions Widget */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-red-lotus text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-800 transition-colors font-bold"
        onClick={() => setShowAuditionWidget(true)}
        aria-label="Open Band Auditions"
      >
        Band Auditions
      </button>
      {showAuditionWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white text-black rounded-xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
              onClick={() => setShowAuditionWidget(false)}
              aria-label="Close Band Audition Form"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold mb-4 text-center uppercase">Band Audition</h2>
            <BandAuditionForm onSubmit={handleBandAuditionSubmit} />
          </div>
        </div>
      )}
    </>
  );
}

// MusicUploadForm component (Client-Side)
function MusicUploadForm({ onUpload }: { onUpload: (music: Omit<UploadedMusic, 'id' | 'purchaseCount' | 'clickCount'>) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1.99);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [albumArtFile, setAlbumArtFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (!title || !musicFile) {
      setError('Title and Music File are required.');
      return;
    }
    
    setUploading(true);

    try {
      // Dynamically import the upload function only when needed on the client
      const { upload } = await import('@vercel/blob/client');
      
      let musicBlobUrl = '';
      let albumArtUrl: string | undefined = undefined;

      // Define options for upload
      const options: UploadOptions = {
        access: 'public',
        // Crucial: Point this to your deployed API route
        handleUploadUrl: '/api/blob/upload', 
      };

      // Upload music file
      const musicBlob = await upload(musicFile.name, musicFile, options);
      musicBlobUrl = musicBlob.url;
      
      // Upload album art if present
      if (albumArtFile) {
        const albumArtBlob = await upload(albumArtFile.name, albumArtFile, options);
        albumArtUrl = albumArtBlob.url;
      }
      
      onUpload({
        title,
        description,
        price,
        fileUrl: musicBlobUrl,
        albumArtUrl,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice(1.99);
      setMusicFile(null);
      setAlbumArtFile(null);
    } catch (err) {
      console.error("Error during upload:", err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      // Keep form data populated so user doesn't lose input
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      {/* Display error message */}
      {error && <div className="p-2 bg-red-800 text-white rounded mb-3">{error}</div>}
      
      <input 
        type="text" 
        placeholder="Title" 
        className="w-full p-2 rounded bg-gray-700 text-white" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="Description" 
        className="w-full p-2 rounded bg-gray-700 text-white" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
      />
      <input 
        type="number" 
        min={0.5} 
        step={0.01} 
        placeholder="Price" 
        className="w-full p-2 rounded bg-gray-700 text-white" 
        value={price} 
        onChange={e => setPrice(Number(e.target.value))} 
        required 
      />
      <div>
        <label className="block mb-1 text-white">Music File*</label>
        <input 
          type="file" 
          accept="audio/*" 
          className="w-full p-2 rounded bg-gray-700 text-white" 
          onChange={e => setMusicFile(e.target.files?.[0] || null)} 
          required 
        />
      </div>
      <div>
        <label className="block mb-1 text-white">Album Art (optional)</label>
        <input 
          type="file" 
          accept="image/*" 
          className="w-full p-2 rounded bg-gray-700 text-white" 
          onChange={e => setAlbumArtFile(e.target.files?.[0] || null)} 
        />
      </div>
      <button 
        type="submit" 
        className="bg-green-600 px-4 py-2 rounded text-white font-bold disabled:opacity-50" 
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

export default App;

