import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import BandAuditionForm from './components/BandAuditionForm';

import lotusForEachAlbum from './assets/lotus-each-album.png'; // or .jpg, .jpeg, etc. as appropriate

import redLotusAlbumRap from './assets/red-lotus-album-rap.jpeg';
import yellowLotusAlbumPop from './assets/yellow-lotus-album-pop.jpeg'; 
import blueLotusAlbumRnb from './assets/blue-lotus-album-rnb.jpeg';
import redLotusImage from './assets/red-lotus-image.png';
import yellowLotusImage from './assets/yellow-lotus-image.png';
import blueLotusImage from './assets/blue-lotus-image.png';
import brownLotusImage from './assets/brown-lotus-image.png';
import pinkLotusImageJPEG from './assets/pink-lotus-image.JPEG'; // Corrected filename with hyphen instead of space
import behindTheScenesMain from './assets/behind-the-scenes-main-image.JPEG';
import behindTheScenes2 from './assets/behind-the-scenes-image2.JPEG';
import behindTheScenes3 from './assets/behind-the-scenes-image3.JPEG';
import artistMain from './assets/artist-image-main.JPEG';
import artistImage1 from './assets/aritst-image1.JPEG'; // Note: filename has typo 'aritst' instead of 'artist'
import artistImage2 from './assets/artist-image2.JPEG';
import artistImage3 from './assets/artist-image3.JPEG';
import artistImage4 from './assets/artist-image4.JPEG';
import artistSecondaryLogo from './assets/artist-secondary-logo-image.jpeg';

type ThemeName = 'red' | 'yellow' | 'blue' | 'green' | 'brown' | 'pink';

function MusicPurchaseForm({ m, onPurchase }: { m: any; onPurchase: (purchase: { id: string; title: string; type: 'music' | 'video'; user: string; email: string; amount: number; downloadUrl: string }) => void }) {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(m.price);
  const [success, setSuccess] = useState(false);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onPurchase({
          id: m.id,
          title: m.title,
          type: 'music',
          user,
          email,
          amount,
          downloadUrl: m.fileUrl,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }}
    >
      <input
        type="text"
        className="px-2 py-1 border rounded"
        placeholder="Your Name"
        value={user}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
        required
      />
      <input
        type="email"
        className="px-2 py-1 border rounded"
        placeholder="Your Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
      />
      <input
        type="number"
        min={m.price}
        max={8000}
        className="px-2 py-1 border rounded"
        value={amount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
        required
      />
      <button
        type="submit"
        className="bg-blue-lotus text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
      >
        Purchase & Download
      </button>
      {success && (
        <div className="text-green-600 font-bold mt-2">
          Thank you! <a href={m.fileUrl} download className="underline">Download Now</a>
        </div>
      )}
    </form>
  );
}

function VideoPurchaseForm({ m, onPurchase }: { m: any; onPurchase: (purchase: { id: string; title: string; type: 'music' | 'video'; user: string; email: string; amount: number; downloadUrl: string }) => void }) {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(m.videoPrice || 1);
  const [success, setSuccess] = useState(false);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onPurchase({
          id: m.id,
          title: m.title,
          type: 'video',
          user,
          email,
          amount,
          downloadUrl: m.videoUrl,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }}
    >
      <input
        type="text"
        className="px-2 py-1 border rounded"
        placeholder="Your Name"
        value={user}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
        required
      />
      <input
        type="email"
        className="px-2 py-1 border rounded"
        placeholder="Your Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        required
      />
      <input
        type="number"
        min={m.videoPrice}
        max={8000}
        className="px-2 py-1 border rounded"
        value={amount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
        required
      />
      <button
        type="submit"
        className="bg-blue-lotus text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
      >
        Purchase & Download Video
      </button>
      {success && (
        <div className="text-green-600 font-bold mt-2">
          Thank you! <a href={m.videoUrl} download className="underline">Download Video</a>
        </div>
      )}
    </form>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState<string>('main');
  const [showAuditionWidget, setShowAuditionWidget] = useState(false);
  const [activeTribe, setActiveTribe] = useState<ThemeName>('red'); // Default to 'red'
  const [showTribeOverlay, setShowTribeOverlay] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'music' | 'vibes' | 'community' | 'store' | 'analytics' | 'logout'>('dashboard');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [messages, setMessages] = useState<{ message: string; scheduled: string | null }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [quotes, setQuotes] = useState<Record<string, string>>({
    red: 'Winter energy and focused motivation. For those moments of intensity and drive.',
    yellow: 'Summer energy and uplifting positivity. For your brightest and most joyful moments.',
    blue: 'Spring renewal and calm reflection. Perfect for thoughtful, peaceful times.',
    brown: 'Autumn grounding and earthy connection. For stability and natural harmony.',
    pink: 'Love energy and emotional connection. For romantic and heartfelt expression.',
  });

  // Replace demo analytics data with real-time placeholders
  const [analytics, setAnalytics] = useState({
    visitors: 0,
    signups: 0,
    musicStreams: 0,
    tribeSelections: {
      red: 0,
      yellow: 0,
      blue: 0
    }
  });

  useEffect(() => {
    // Placeholder for real-time analytics fetching logic
    const fetchAnalytics = async () => {
      try {
        // Replace with actual API or database call
        const realTimeData = {
          visitors: await getRealTimeVisitors(),
          signups: await getRealTimeSignups(),
          musicStreams: await getRealTimeMusicStreams(),
          tribeSelections: {
            red: await getRealTimeTribeSelections('red'),
            yellow: await getRealTimeTribeSelections('yellow'),
            blue: await getRealTimeTribeSelections('blue')
          }
        };
        setAnalytics(realTimeData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  // Add state for community chat/messages per tribe
  const [tribeMessages, setTribeMessages] = useState<Record<ThemeName, { user: string; text: string; time: string }[]>>({
    red: [],
    yellow: [],
    blue: [],
    green: [],
    brown: [],
    pink: [],
  });
  const [tribeUser, setTribeUser] = useState('');
  const [tribeText, setTribeText] = useState('');
  const [tribeSelected, setTribeSelected] = useState<'red' | 'yellow' | 'blue'>('red');
  const [tribeSignedIn, setTribeSignedIn] = useState(false);

  // Add new state for extra sign up fields
  const [signupCity, setSignupCity] = useState('');
  const [signupTribe, setSignupTribe] = useState<'red' | 'yellow' | 'blue' | ''>('');
  const [signupPhone, setSignupPhone] = useState('');

  // Add state for Live Performance
  const [liveAmount, setLiveAmount] = useState<number>(10);
  const [livePaymentSuccess, setLivePaymentSuccess] = useState(false);

  // Add state for analytics and video forum
  const [songClicks, setSongClicks] = useState<Record<string, number>>({});
  const [tribeClicks, setTribeClicks] = useState<Record<'red' | 'yellow' | 'blue', number>>({ red: 0, yellow: 0, blue: 0 });
  const [videoForum, setVideoForum] = useState<Record<'red' | 'yellow' | 'blue', { user: string; url: string; comment: string }[]>>({
    red: [],
    yellow: [],
    blue: [],
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [videoComment, setVideoComment] = useState('');
  const [favoriteSong, setFavoriteSong] = useState('');
  const [showLive, setShowLive] = useState(false);
  const [showTourSuggest, setShowTourSuggest] = useState(false);
  const [tourSuggestion, setTourSuggestion] = useState('');
  const [tourSuggestions, setTourSuggestions] = useState<{ user: string; city: string; tribe: string; suggestion: string }[]>([]);

  // Add state for music uploads and sales
  const [musicList, setMusicList] = useState<
    {
      id: string;
      title: string;
      price: number;
      fileUrl: string;
      bonusFileUrl?: string;
      videoUrl?: string;
      videoPrice?: number;
      downloads: number;
      videoDownloads: number;
    }[]
  >([]);
  const [musicTitle, setMusicTitle] = useState('');
  const [musicPrice, setMusicPrice] = useState<number>(1);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [bonusFile, setBonusFile] = useState<File | null>(null);
  const [musicVideo, setMusicVideo] = useState<File | null>(null);
  const [musicVideoPrice, setMusicVideoPrice] = useState<number>(1);

  // Add state for public music/video store purchases and band applications
  const [publicPurchases, setPublicPurchases] = useState<{ id: string; title: string; type: 'music' | 'video'; user: string; email: string; amount: number; downloadUrl: string }[]>([]);
  const [showMusicStore, setShowMusicStore] = useState(false);
  const [showVideoStore, setShowVideoStore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [bandApplications, setBandApplications] = useState<{ name: string; email: string; instrument: string; message: string; date: string }[]>([]);

  // Add state for live show features
  const [selectedShow, setSelectedShow] = useState<{ id: string; title: string; date: string; price: number } | null>(null);
  const [liveMerch, setLiveMerch] = useState([
    { id: 'shirt', name: 'Red Lotus T-Shirt', price: 30 },
    { id: 'poster', name: 'Signed Poster', price: 50 },
    { id: 'vip', name: 'VIP Backstage Pass', price: 200 },
  ]);
  const [selectedMerch, setSelectedMerch] = useState<string[]>([]);
  const [showMerchSuccess, setShowMerchSuccess] = useState(false);

  // Example show times
  const liveShows = [
    { id: '1', title: 'Red Lotus VR Experience', date: '2024-07-20 8:00 PM', price: 25 },
    { id: '2', title: 'Oculus 360° Immersive Show', date: '2024-08-05 9:00 PM', price: 40 },
    { id: '3', title: 'Exclusive Streaming Night', date: '2024-08-18 7:30 PM', price: 15 },
  ];

  // Simulate file upload (replace with real backend in production)
  async function fakeUpload(file: File): Promise<string> {
    return Promise.resolve(URL.createObjectURL(file));
  }

  // Dummy admin credentials (replace with secure method in production)
  const ADMIN_USER = 'artist';
  const ADMIN_PASS = 'lotus123';

  useEffect(() => {
    document.title = 'Red Lotus | Official Site';
  }, []);

  // Band audition form handler (collects applications for dashboard)
  function handleBandAuditionSubmit(form: { name: string; email: string; instrument: string; message: string }) {
    setBandApplications(apps => [
      ...apps,
      { ...form, date: new Date().toLocaleString() }
    ]);
    alert('Band audition submitted!');
  }

  const handleTribeSignup = (e: FormEvent) => {
    e.preventDefault();
    if (signupEmail) {
      setSignupSuccess(true);
      setSignupEmail('');
      setTimeout(() => setSignupSuccess(false), 4000);
    }
  };

  function handleAdminLogin(e: FormEvent) {
    e.preventDefault();
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminUser('');
      setAdminPass('');
    } else {
      alert('Invalid credentials');
    }
  }

  function handleAdminLogout() {
    setAdminLoggedIn(false);
    setAdminTab('dashboard');
  }

  // Define theme colors mapping for header
  const themeColors: Record<ThemeName, string> = {
    red: 'bg-red-lotus',
    yellow: 'bg-yellow-lotus',
    blue: 'bg-blue-lotus',
    green: 'bg-green-lotus',
    brown: 'bg-brown-lotus',
    pink: 'bg-pink-lotus',
  };

  // Tribe color schemes
  const tribeThemes: Record<ThemeName, { bg: string; text: string }> = {
    red: { bg: 'bg-red-lotus', text: 'text-white' },
    yellow: { bg: 'bg-yellow-lotus', text: 'text-black' },
    blue: { bg: 'bg-blue-lotus', text: 'text-white' },
    green: { bg: 'bg-green-lotus', text: 'text-white' },
    brown: { bg: 'bg-brown-lotus', text: 'text-white' },
    pink: { bg: 'bg-pink-lotus', text: 'text-white' },
  };

  // Add state for mobile navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle tribe selection with overlay and color scheme change
  const handleTribeSelect = (tribe: 'red' | 'yellow' | 'blue') => {
    setShowTribeOverlay(true);
    setTimeout(() => {
      setActiveTribe(tribe);
      setShowTribeOverlay(false);
    }, 1200); // Overlay duration

    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // SYSTEM TESTS (run automatically in dev, remove in prod)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Music upload test
      (async () => {
        // Simulate upload
        const fakeFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
        const url = await fakeUpload(fakeFile);
        if (!url) throw new Error('Music upload failed');
      })();

      // Analytics test
      if (typeof analytics.visitors !== 'number' || typeof analytics.signups !== 'number') {
        throw new Error('Analytics data type error');
      }

      // Tribe chat test
      if (!tribeMessages.red || !Array.isArray(tribeMessages.red)) {
        throw new Error('Tribe chat not initialized');
      }

      // Video forum test
      if (!videoForum.red || !Array.isArray(videoForum.red)) {
        throw new Error('Video forum not initialized');
      }
    }
    // eslint-disable-next-line
  }, []); // Only run once on mount

  // Only render the Admin Panel if logged in, and prevent rendering the rest of the site UI
  if (adminLoggedIn) {
    return (
      <div className="min-h-screen bg-black/80 flex items-center justify-center">
        <div className="bg-white text-black rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
          <button
            className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
            onClick={handleAdminLogout}
            aria-label="Logout Admin"
          >
            ×
          </button>
          <h2 className="text-3xl font-bold mb-4 text-center">Artist Admin Panel</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <button onClick={() => setAdminTab('dashboard')} className={`px-4 py-2 rounded ${adminTab === 'dashboard' ? 'bg-blue-lotus text-white' : 'bg-gray-200'}`}>Dashboard</button>
            <button onClick={() => setAdminTab('music')} className={`px-4 py-2 rounded ${adminTab === 'music' ? 'bg-blue-lotus text-white' : 'bg-gray-200'}`}>Music</button>
            <button onClick={() => setAdminTab('vibes')} className={`px-4 py-2 rounded ${adminTab === 'vibes' ? 'bg-blue-lotus text-white' : 'bg-gray-200'}`}>Vibes</button>
            <button onClick={() => setAdminTab('community')} className={`px-4 py-2 rounded ${adminTab === 'community' ? 'bg-blue-lotus text-white' : 'bg-gray-200'}`}>Community</button>
            <button onClick={() => setAdminTab('store')} className={`px-4 py-2 rounded ${adminTab === 'store' ? 'bg-blue-lotus text-white' : 'bg-gray-200'}`}>Store</button>
            <button onClick={() => setAdminTab('analytics')} className={`px-4 py-2 rounded ${adminTab === 'analytics' ? 'bg-blue-lotus text-white' : 'bg-gray-200'}`}>Analytics</button>
            <button onClick={handleAdminLogout} className="px-4 py-2 rounded bg-red-600 text-white">Logout</button>
          </div>
          <div>
            {adminTab === 'dashboard' && (
              <div>
                <h3 className="text-xl font-bold mb-2">Dashboard</h3>
                <p>Welcome, Artist! Use the tabs above to manage your site.</p>
              </div>
            )}
            {adminTab === 'music' && (
              <div>
                <h3 className="text-xl font-bold mb-2">Music Management</h3>
                <form
                  className="space-y-4 mb-8"
                  onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (!musicTitle || !musicFile) return;
                    const fileUrl = await fakeUpload(musicFile);
                    let bonusUrl = '';
                    let videoUrl = '';
                    if (bonusFile) bonusUrl = await fakeUpload(bonusFile);
                    if (musicVideo) videoUrl = await fakeUpload(musicVideo);
                    setMusicList(list => [
                      ...list,
                      {
                        id: Date.now().toString(),
                        title: musicTitle,
                        price: musicPrice,
                        fileUrl,
                        bonusFileUrl: bonusUrl || undefined,
                        videoUrl: videoUrl || undefined,
                        videoPrice: musicVideo ? musicVideoPrice : undefined,
                        downloads: 0,
                        videoDownloads: 0,
                      },
                    ]);
                    setMusicTitle('');
                    setMusicPrice(1);
                    setMusicFile(null);
                    setBonusFile(null);
                    setMusicVideo(null);
                    setMusicVideoPrice(1);
                  }}
                >
                  <div>
                    <label className="font-semibold">Song Title</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded"
                      value={musicTitle}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMusicTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Price ($1+)</label>
                    <input
                      type="number"
                      min={1}
                      max={8000}
                      className="w-32 px-2 py-1 border rounded"
                      value={musicPrice}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMusicPrice(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Music File</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMusicFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Bonus File (optional)</label>
                    <input
                      type="file"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setBonusFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Music Video (optional)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMusicVideo(e.target.files?.[0] || null)}
                    />
                    {musicVideo && (
                      <div className="mt-2">
                        <label className="font-semibold">Video Price ($1-$8000)</label>
                        <input
                          type="number"
                          min={1}
                          max={8000}
                          className="w-32 px-2 py-1 border rounded"
                          value={musicVideoPrice}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setMusicVideoPrice(Number(e.target.value))}
                          required
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-lotus text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                  >
                    Upload & Add
                  </button>
                </form>
                <h4 className="font-bold mb-2">Your Uploaded Music</h4>
                <ul className="space-y-4">
                  {musicList.length === 0 && <li className="text-gray-500">No music uploaded yet.</li>}
                  {musicList.map(m => (
                    <li key={m.id} className="border rounded p-2 flex flex-col gap-2">
                      <div>
                        <span className="font-bold">{m.title}</span> — ${m.price}
                        <button
                          className="ml-4 text-red-600 underline"
                          onClick={() => setMusicList(list => list.filter(x => x.id !== m.id))}
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <a href={m.fileUrl} download className="text-blue-600 underline">Download Song</a>
                        {m.bonusFileUrl && (
                          <a href={m.bonusFileUrl} download className="ml-4 text-green-600 underline">Bonus Download</a>
                        )}
                      </div>
                      {m.videoUrl && (
                        <div>
                          <span className="font-bold">Music Video:</span>
                          <a href={m.videoUrl} download className="ml-2 text-blue-600 underline">Download Video</a>
                          <span className="ml-2">(${m.videoPrice})</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Song Downloads: {m.downloads} | Video Downloads: {m.videoDownloads}
                      </div>
                    </li>
                  ))}
                </ul>
                <h4 className="font-bold mt-8 mb-2">Band Applications</h4>
                <ul className="space-y-2">
                  {bandApplications.length === 0 && <li className="text-gray-500">No applications yet.</li>}
                  {bandApplications.map((app, idx) => (
                    <li key={idx} className="border rounded p-2">
                      <div><strong>Name:</strong> {app.name}</div>
                      <div><strong>Email:</strong> {app.email}</div>
                      <div><strong>Instrument:</strong> {app.instrument}</div>
                      <div><strong>Message:</strong> {app.message}</div>
                      <div className="text-xs text-gray-500">{app.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {adminTab === 'vibes' && (
              <div>
                <h3 className="text-xl font-bold mb-2">Vibrate Quotes Management</h3>
                <p>Update the quote for each Vibe section below:</p>
                <form className="space-y-4 mt-4">
                  {Object.entries(quotes).map(([color, quote]) => (
                    <div key={color} className="flex flex-col mb-2">
                      <label className="font-semibold capitalize mb-1">{color} Vibe Quote</label>
                      <textarea
                        className="border rounded p-2"
                        value={quotes[color]}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setQuotes(q => ({ ...q, [color]: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  ))}
                </form>
                <div className="mt-4 text-green-700">Quotes are updated live for the Vibrate section.</div>
              </div>
            )}
            {adminTab === 'community' && (
              <div>
                <h3 className="text-xl font-bold mb-2">Community Messaging</h3>
                <form
                  className="flex flex-col gap-2 mb-4"
                  onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    if (!newMessage) return;
                    setMessages([
                      ...messages,
                      { message: newMessage, scheduled: scheduleDate ? scheduleDate : null },
                    ]);
                    setNewMessage('');
                    setScheduleDate('');
                  }}
                >
                  <textarea
                    className="border rounded p-2"
                    placeholder="Type your message to the community..."
                    value={newMessage}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                    rows={3}
                    required
                  />
                  <div className="flex items-center gap-2">
                    <label className="font-semibold">Schedule:</label>
                    <input
                      type="datetime-local"
                      className="border rounded px-2 py-1"
                      value={scheduleDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setScheduleDate(e.target.value)}
                    />
                    <span className="text-gray-500 text-sm">(Leave blank to send now)</span>
                  </div>
                  <button type="submit" className="bg-blue-lotus text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                    Send Message
                  </button>
                </form>
                <div>
                  <h4 className="font-bold mb-2">Previous & Scheduled Messages</h4>
                  <ul className="space-y-2">
                    {messages.length === 0 && <li className="text-gray-500">No messages yet.</li>}
                    {messages.map((msg, idx) => (
                      <li key={idx} className="border rounded p-2">
                        <div>{msg.message}</div>
                        {msg.scheduled && (
                          <div className="text-xs text-gray-500">Scheduled: {msg.scheduled}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {adminTab === 'store' && (
              <div>
                <h3 className="text-xl font-bold mb-2">Store Management</h3>
                <p>Manage store items and pricing here.</p>
                {/* Add your store management UI here */}
              </div>
            )}
            {adminTab === 'analytics' && (
              <div>
                <h3 className="text-xl font-bold mb-2">Site Analytics</h3>
                <ul className="mb-2">
                  <li><strong>Visitors:</strong> {analytics.visitors}</li>
                  <li><strong>Signups:</strong> {analytics.signups}</li>
                  <li><strong>Music Streams:</strong> {analytics.musicStreams}</li>
                  <li>
                    <strong>Tribe Selections:</strong>
                    <ul className="ml-4">
                      <li>Red: {analytics.tribeSelections.red}</li>
                      <li>Yellow: {analytics.tribeSelections.yellow}</li>
                      <li>Blue: {analytics.tribeSelections.blue}</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Song Clicks:</strong>
                    <ul className="ml-4">
                      {Object.entries(songClicks).map(([song, count]) => (
                        <li key={song}>{song}: {count}</li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <strong>Tribe Clicks:</strong>
                    <ul className="ml-4">
                      <li>Red: {tribeClicks.red}</li>
                      <li>Yellow: {tribeClicks.yellow}</li>
                      <li>Blue: {tribeClicks.blue}</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Video Forum Posts:</strong>
                    <ul className="ml-4">
                      <li>Red: {videoForum.red.length}</li>
                      <li>Yellow: {videoForum.yellow.length}</li>
                      <li>Blue: {videoForum.blue.length}</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Tour Suggestions:</strong>
                    <ul className="ml-4">
                      {tourSuggestions.map((s, idx) => (
                        <li key={idx}>{s.user} ({s.city}, {s.tribe}): {s.suggestion}</li>
                      ))}
                    </ul>
                  </li>
                  {/* Add more analytics as needed */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ease-in-out ${tribeThemes[activeTribe].bg} ${tribeThemes[activeTribe].text}`}>
        {/* Tribe Overlay */}
        {showTribeOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity">
            <div className="text-center">
              <img src={lotusForEachAlbum} alt="Tribe Overlay" className="w-40 h-40 mx-auto animate-pulse" />
              <h2 className="text-4xl font-bold mt-6 text-white uppercase">Welcome to the {activeTribe.charAt(0).toUpperCase() + activeTribe.slice(1)} Tribe</h2>
            </div>
          </div>
        )}

        {/* Header with Navigation */}
        <header className={`p-4 ${themeColors[activeTribe]} sticky top-0 z-10 transition-colors duration-300 ease-in-out`}>
          <div className="container mx-auto flex items-center justify-between">
            <h1
              className="text-xl font-bold text-white text-left flex-shrink-0"
              aria-label="Red Lotus Home"
              style={{ letterSpacing: '0.05em' }}
            >
              Red Lotus
            </h1>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 mx-auto bg-black/70 px-6 py-2 rounded-full">
              <button 
                onClick={() => setActiveSection('main')}
                className={`px-3 py-1 rounded-md ${activeSection === 'main' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                HUT
              </button>
              <button 
                onClick={() => setActiveSection('music')}
                className={`px-3 py-1 rounded-md ${activeSection === 'music' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                MUSIC
              </button>
              <button 
                onClick={() => setActiveSection('vibes')}
                className={`px-3 py-1 rounded-md ${activeSection === 'vibes' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                VIBRATE
              </button>
              <span className="mx-4 flex items-center justify-center">
                <img src={lotusForEachAlbum} alt="Lotus Nav Center" className="w-16 h-16 object-contain" />
              </span>
              <button 
                onClick={() => setActiveSection('community')}
                className={`px-3 py-1 rounded-md ${activeSection === 'community' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                TRIBE
              </button>
              <button 
                onClick={() => setActiveSection('behind-scenes')}
                className={`px-3 py-1 rounded-md ${activeSection === 'behind-scenes' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                BTS
              </button>
              <button 
                onClick={() => setActiveSection('music-store')}
                className={`px-3 py-1 rounded-md ${activeSection === 'music-store' ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                STORE
              </button>
              <button
                onClick={() => setShowLive(true)}
                className={`px-3 py-1 rounded-md ${showLive ? 'bg-white/20 text-white' : 'text-white'}`}
              >
                LIVE
              </button>
            </nav>

            {/* Tribe Nav Links (top right) */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleTribeSelect('red')}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-red-lotus border-4 border-white shadow-lg flex items-center justify-center"
                title="Red Tribe"
              >
                <img src={lotusForEachAlbum} alt="Red Lotus Icon" className="w-[80%] h-[80%] object-contain" style={{ background: 'transparent' }} />
              </button>
              <button
                onClick={() => handleTribeSelect('yellow')}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-yellow-lotus border-4 border-white shadow-lg flex items-center justify-center"
                title="Yellow Tribe"
              >
                <img src={lotusForEachAlbum} alt="Yellow Lotus Icon" className="w-[80%] h-[80%] object-contain" style={{ background: 'transparent' }} />
              </button>
              <button
                onClick={() => handleTribeSelect('blue')}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-blue-lotus border-4 border-white shadow-lg flex items-center justify-center"
                title="Blue Tribe"
              >
                <img src={lotusForEachAlbum} alt="Blue Lotus Icon" className="w-[80%] h-[80%] object-contain" style={{ background: 'transparent' }} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/90 mt-4 rounded-lg p-4 flex flex-col space-y-3 text-center transition-all duration-300 ease-in-out">
              <button 
                onClick={() => {setActiveSection('main'); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${activeSection === 'main' ? 'bg-white/20' : ''} text-white`}
              >
                HUT
              </button>
              <button 
                onClick={() => {setActiveSection('music'); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${activeSection === 'music' ? 'bg-white/20' : ''} text-white`}
              >
                MUSIC
              </button>
              <button 
                onClick={() => {setActiveSection('vibes'); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${activeSection === 'vibes' ? 'bg-white/20' : ''} text-white`}
              >
                VIBRATE
              </button>
              <button 
                onClick={() => {setActiveSection('community'); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${activeSection === 'community' ? 'bg-white/20' : ''} text-white`}
              >
                TRIBE
              </button>
              <button 
                onClick={() => {setActiveSection('behind-scenes'); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${activeSection === 'behind-scenes' ? 'bg-white/20' : ''} text-white`}
              >
                BTS
              </button>
              <button 
                onClick={() => {setActiveSection('music-store'); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${activeSection === 'music-store' ? 'bg-white/20' : ''} text-white`}
              >
                STORE
              </button>
              <button
                onClick={() => {setShowLive(true); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${showLive ? 'bg-white/20' : ''} text-white`}
              >
                LIVE
              </button>
              <button
                onClick={() => {setShowMusicStore(true); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${showMusicStore ? 'bg-white/20' : ''} text-white`}
              >
                Buy Music
              </button>
              <button
                onClick={() => {setShowVideoStore(true); setMobileMenuOpen(false);}}
                className={`px-3 py-2 rounded-md ${showVideoStore ? 'bg-white/20' : ''} text-white`}
              >
                Buy Videos
              </button>
              
              {/* Mobile Tribe Selection */}
              <div className="flex items-center justify-center space-x-4 pt-2 border-t border-gray-700">
                <button
                  onClick={() => handleTribeSelect('red')}
                  className="w-10 h-10 rounded-full bg-red-lotus border-2 border-white shadow-lg flex items-center justify-center"
                  title="Red Tribe"
                >
                  <img src={lotusForEachAlbum} alt="Red Lotus Icon" className="w-[80%] h-[80%] object-contain" style={{ background: 'transparent' }} />
                </button>
                <button
                  onClick={() => handleTribeSelect('yellow')}
                  className="w-10 h-10 rounded-full bg-yellow-lotus border-2 border-white shadow-lg flex items-center justify-center"
                  title="Yellow Tribe"
                >
                  <img src={lotusForEachAlbum} alt="Yellow Lotus Icon" className="w-[80%] h-[80%] object-contain" style={{ background: 'transparent' }} />
                </button>
                <button
                  onClick={() => handleTribeSelect('blue')}
                  className="w-10 h-10 rounded-full bg-blue-lotus border-2 border-white shadow-lg flex items-center justify-center"
                  title="Blue Tribe"
                >
                  <img src={lotusForEachAlbum} alt="Blue Lotus Icon" className="w-[80%] h-[80%] object-contain" style={{ background: 'transparent' }} />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Admin Modal */}
        {showAdminLogin && !adminLoggedIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-white text-black rounded-xl shadow-2xl max-w-sm w-full p-8 relative">
              <button
                className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
                onClick={() => setShowAdminLogin(false)}
                aria-label="Close Admin Login"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">Artist Admin Login</h2>
              <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="px-4 py-2 rounded bg-gray-100"
                  value={adminUser}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminUser(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="px-4 py-2 rounded bg-gray-100"
                  value={adminPass}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAdminPass(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-lotus text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Live Performance Modal/Page */}
        {showLive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-lotus via-black to-red-lotus">
            <div className="bg-black/90 text-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative border-4 border-blue-lotus">
              <button
                className="absolute top-4 right-4 text-2xl font-bold text-blue-lotus hover:text-yellow-lotus"
                onClick={() => setShowLive(false)}
                aria-label="Close Live Performance"
              >
                ×
              </button>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Theater Section */}
                <div className="flex-1 flex flex-col items-center">
                  <h2 className="text-4xl font-extrabold mb-2 text-yellow-lotus tracking-widest">Red Lotus LIVE</h2>
                  <div className="mb-4 text-lg text-blue-200">Welcome to the Futuristic Lotus Theater</div>
                  <div className="w-full flex flex-col items-center mb-6">
                    <div className="w-full bg-gradient-to-r from-red-lotus via-yellow-lotus to-blue-lotus rounded-lg p-4 shadow-lg">
                      <h3 className="text-2xl font-bold mb-2 text-black">Upcoming Shows</h3>
                      <ul className="space-y-2">
                        {liveShows.map(show => (
                          <li key={show.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-black/60 rounded p-2">
                            <span>
                              <span className="font-bold text-yellow-lotus">{show.title}</span>
                              <span className="ml-2 text-blue-100">{show.date}</span>
                            </span>
                            <span className="flex items-center gap-2 mt-2 md:mt-0">
                              <span className="text-green-300 font-bold">${show.price}</span>
                              <button
                                className={`px-3 py-1 rounded bg-blue-lotus text-white font-bold hover:bg-yellow-lotus hover:text-black transition-colors`}
                                onClick={() => setSelectedShow(show)}
                              >
                                {selectedShow?.id === show.id ? 'Selected' : 'Get Ticket'}
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Theater Seats */}
                  <div className="w-full flex flex-col items-center mb-6">
                    <h4 className="text-xl font-bold mb-2 text-yellow-lotus">Theater Seats</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span
                          key={i}
                          className={`inline-block w-6 h-6 rounded-full border-2 border-blue-lotus ${i % 3 === 0 ? 'bg-red-lotus' : i % 3 === 1 ? 'bg-yellow-lotus' : 'bg-blue-lotus'} opacity-80`}
                          title={`Seat ${i + 1}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">* Virtual seating for immersive experience</div>
                  </div>
                  {/* Ticket Purchase */}
                  {selectedShow && (
                    <form
                      className="flex flex-col items-center gap-2 mb-4"
                      onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setLivePaymentSuccess(true);
                        setTimeout(() => {
                          setLivePaymentSuccess(false);
                          setShowLive(false);
                          setSelectedShow(null);
                        }, 2000);
                      }}
                    >
                      <label className="font-bold">Pay What You Want (${selectedShow.price} - $8000):</label>
                      <input
                        type="number"
                        min={selectedShow.price}
                        max={8000}
                        value={liveAmount}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLiveAmount(Number(e.target.value))}
                        className="w-32 px-4 py-2 rounded bg-gray-200 text-black text-center font-bold"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 bg-yellow-lotus text-black font-bold rounded hover:bg-blue-lotus hover:text-white transition-colors"
                      >
                        Pay & Reserve Seat
                      </button>
                      {livePaymentSuccess && <div className="text-green-400 font-bold mt-2">Thank you! Your seat is reserved.</div>}
                    </form>
                  )}
                </div>
                {/* Concession Stand */}
                <div className="flex-1 flex flex-col items-center border-l-2 border-blue-lotus pl-8">
                  <h3 className="text-2xl font-bold mb-4 text-yellow-lotus">Concession Stand</h3>
                  <div className="w-full bg-black/60 rounded-lg p-4 shadow-lg mb-4">
                    <ul className="space-y-3">
                      {liveMerch.map(item => (
                        <li key={item.id} className="flex items-center justify-between">
                          <span className="font-bold">{item.name}</span>
                          <span className="text-green-300 font-bold">${item.price}</span>
                          <button
                            className={`ml-2 px-3 py-1 rounded ${selectedMerch.includes(item.id) ? 'bg-yellow-lotus text-black' : 'bg-blue-lotus text-white'} font-bold`}
                            onClick={() => setSelectedMerch(sel =>
                              sel.includes(item.id)
                                ? sel.filter(id => id !== item.id)
                                : [...sel, item.id]
                            )}
                          >
                            {selectedMerch.includes(item.id) ? 'Added' : 'Add'}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <form
                      className="mt-4 flex flex-col items-center gap-2"
                      onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setShowMerchSuccess(true);
                        setTimeout(() => setShowMerchSuccess(false), 2000);
                        setSelectedMerch([]);
                      }}
                    >
                      <button
                        type="submit"
                        className="px-6 py-2 bg-yellow-lotus text-black font-bold rounded hover:bg-blue-lotus hover:text-white transition-colors"
                        disabled={selectedMerch.length === 0}
                      >
                        Buy Selected
                      </button>
                      {showMerchSuccess && <div className="text-green-400 font-bold mt-2">Thank you for your support!</div>}
                    </form>
                  </div>
                  <div className="text-center text-sm text-blue-200 mt-4">
                    Show your love for Red Lotus during the performance!<br />
                    All purchases support future shows and exclusive content.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Music Store Page (public, for anyone to purchase music/video) */}
        {showMusicStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="bg-white text-black rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
              <button
                className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
                onClick={() => setShowMusicStore(false)}
                aria-label="Close Music Store"
              >
                ×
              </button>
              <h2 className="text-3xl font-bold mb-4 text-center">Red Lotus Music Store</h2>
              <ul className="space-y-6">
                {musicList.length === 0 && <li className="text-gray-500">No music available yet.</li>}
                {musicList.map(m => (
                  <li key={m.id} className="border rounded p-4 flex flex-col gap-2">
                    <div>
                      <span className="font-bold">{m.title}</span> — ${m.price}
                    </div>
                    <MusicPurchaseForm
                      m={m}
                      onPurchase={purchase =>
                        setPublicPurchases(p => [...p, purchase])
                      }
                    />
                    {m.bonusFileUrl && (
                      <div>
                        <span className="font-bold">Bonus:</span>
                        <a href={m.bonusFileUrl} download className="ml-2 text-green-600 underline">Download Bonus</a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-center">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowMusicStore(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Store Page (public, for anyone to purchase videos) */}
        {showVideoStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="bg-white text-black rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
              <button
                className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
                onClick={() => setShowVideoStore(false)}
                aria-label="Close Video Store"
              >
                ×
              </button>
              <h2 className="text-3xl font-bold mb-4 text-center">Red Lotus Video Store</h2>
              <ul className="space-y-6">
                {musicList.filter(m => m.videoUrl).length === 0 && <li className="text-gray-500">No videos available yet.</li>}
                {musicList.filter(m => m.videoUrl).map(m => (
                  <li key={m.id} className="border rounded p-4 flex flex-col gap-2">
                    <div>
                      <span className="font-bold">{m.title} (Video)</span> — ${m.videoPrice}
                    </div>
                    <VideoPurchaseForm
                      m={m}
                      onPurchase={purchase =>
                        setPublicPurchases(p => [...p, purchase])
                      }
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-center">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowVideoStore(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main>
          {/* Main Landing Section */}
          <section
            id="main"
            className={activeSection === 'main' ? 'block' : 'hidden'}
            style={{
              backgroundImage: `url(${artistSecondaryLogo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '100vh'
            }}
          >
            <div className="h-screen flex items-center justify-center relative">
              <div className="text-center z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">Red Lotus</h1>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setActiveSection('music')}
                    className="px-6 py-3 bg-red-lotus hover:bg-red-700 rounded-full text-white font-medium transition-colors"
                  >
                    Explore
                  </button>
                  <button 
                    onClick={() => setActiveSection('vibes')}
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
              <div className="container mx-auto px-0">
                <h2 className="text-4xl font-bold mb-8 text-center text-white">Red Lotus Music</h2>
                <div className="flex flex-col gap-0">
                  <div className="w-full h-[40vw] min-h-[300px] relative">
                    <img src={redLotusAlbumRap} alt="Red Lotus Album" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                      <h3 className="text-3xl font-bold text-white mb-2">Red Lotus (Rap)</h3>
                      <p className="text-gray-300 mb-2">Hard-hitting rap tracks for the winter season.</p>
                      <a
                        href="https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-lotus text-white px-4 py-2 rounded-full font-bold"
                        onClick={() => {
                          setSongClicks(sc => ({ ...sc, 'Red Lotus (Rap)': (sc['Red Lotus (Rap)'] || 0) + 1 }));
                          setTribeClicks(tc => ({ ...tc, red: tc.red + 1 }));
                        }}
                      >
                        Stream
                      </a>
                    </div>
                  </div>
                  <div className="w-full h-[40vw] min-h-[300px] relative">
                    <img src={yellowLotusAlbumPop} alt="Yellow Lotus Album" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                      <h3 className="text-3xl font-bold text-white mb-2">Yellow Lotus (Pop)</h3>
                      <p className="text-gray-300 mb-2">Uplifting pop tracks for the summer season.</p>
                      <a href="#" className="bg-yellow-lotus text-black px-4 py-2 rounded-full font-bold">Coming Soon</a>
                    </div>
                  </div>
                  <div className="w-full h-[40vw] min-h-[300px] relative">
                    <img src={blueLotusAlbumRnb} alt="Blue Lotus Album" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                      <h3 className="text-3xl font-bold text-white mb-2">Blue Lotus (R&B)</h3>
                      <p className="text-gray-300 mb-2">Smooth R&B tracks for the spring season.</p>
                      <a href="#" className="bg-blue-lotus text-white px-4 py-2 rounded-full font-bold">Coming Soon</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vibes Section */}
          <section id="vibes" className={activeSection === 'vibes' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-yellow-lotus to-black py-0">
              <div className="flex flex-col w-full">
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={redLotusImage} alt="Red Lotus" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                    <h3 className="text-3xl font-bold text-white mb-2">Red Vibe</h3>
                    <p className="text-white mb-2">{quotes.red}</p>
                  </div>
                </div>
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={yellowLotusImage} alt="Yellow Lotus" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                    <h3 className="text-3xl font-bold text-white mb-2">Yellow Vibe</h3>
                    <p className="text-white mb-2">{quotes.yellow}</p>
                  </div>
                </div>
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={blueLotusImage} alt="Blue Lotus" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                    <h3 className="text-3xl font-bold text-white mb-2">Blue Vibe</h3>
                    <p className="text-white mb-2">{quotes.blue}</p>
                  </div>
                </div>
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={brownLotusImage} alt="Brown Lotus" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                    <h3 className="text-3xl font-bold text-white mb-2">Brown Vibe</h3>
                    <p className="text-white mb-2">{quotes.brown}</p>
                  </div>
                </div>
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={pinkLotusImageJPEG} alt="Pink Lotus" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
                    <h3 className="text-3xl font-bold text-white mb-2">Pink Vibe</h3>
                    <p className="text-white mb-2">{quotes.pink}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Community/Tribe Section */}
          <section id="community" className={activeSection === 'community' && !adminLoggedIn ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-blue-lotus to-black py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8 text-white">Tribe Community</h2>
                {/* Sign Up Coming Soon Section */}
                <div className="max-w-md mx-auto mt-8 mb-12">
                  <h3 className="text-2xl font-bold mb-4 text-white">Sign Up Coming Soon</h3>
                  <p className="text-white mb-4">Enter your info to be notified when your Tribe's Village is ready!</p>
                  <form
                    onSubmit={(e: FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      setSignupSuccess(true);
                      setSignupEmail('');
                      setSignupCity('');
                      setSignupTribe('');
                      setSignupPhone('');
                      setTimeout(() => setSignupSuccess(false), 4000);
                    }}
                    className="flex flex-col gap-2 items-center justify-center"
                  >
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                      placeholder="Your City"
                      value={signupCity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupCity(e.target.value)}
                      required
                    />
                    <select
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                      value={signupTribe}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setSignupTribe(e.target.value as 'red' | 'yellow' | 'blue' | '')}
                      required
                    >
                      <option value="">Select Your Tribe</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="blue">Blue</option>
                    </select>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                      placeholder="Phone Number (optional)"
                      value={signupPhone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupPhone(e.target.value)}
                    />
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                      placeholder="Email (optional)"
                      value={signupEmail}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupEmail(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-lotus text-white font-bold rounded hover:bg-blue-700 transition-colors"
                    >
                      Notify Me
                    </button>
                  </form>
                  {signupSuccess && (
                    <div className="mt-2 text-green-400 font-semibold">Thank you! You'll be notified when your Village is ready.</div>
                  )}
                </div>
                {/* Tribe Community Sign-In */}
                {!tribeSignedIn ? (
                  <div className="max-w-md mx-auto bg-black/60 p-8 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-white">Sign In to Your Tribe</h3>
                    <form
                      onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        if (tribeUser.trim()) setTribeSignedIn(true);
                      }}
                      className="flex flex-col gap-4"
                    >
                      <input
                        type="text"
                        className="px-4 py-2 rounded bg-gray-700 text-white"
                        placeholder="Enter a nickname"
                        value={tribeUser}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTribeUser(e.target.value)}
                        required
                      />
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(['red', 'yellow', 'blue'] as const).map((tribe) => (
                          <button
                            key={tribe}
                            type="button"
                            className={`px-4 py-2 rounded-full font-bold border-2 ${
                              tribeSelected === tribe
                                ? 'border-white bg-white text-black'
                                : `border-${tribe}-lotus bg-${tribe}-lotus text-white`
                            }`}
                            style={{ minWidth: 80 }}
                            onClick={() => setTribeSelected(tribe)}
                          >
                            {tribe.charAt(0).toUpperCase() + tribe.slice(1)}
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-lotus text-white font-bold rounded hover:bg-blue-700 transition-colors"
                      >
                        Enter {tribeSelected.charAt(0).toUpperCase() + tribeSelected.slice(1)} Tribe
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto bg-black/60 p-6 rounded-xl shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="text-xl font-bold text-white mb-2 md:mb-0">
                        {tribeUser} in the {tribeSelected.charAt(0).toUpperCase() + tribeSelected.slice(1)} Tribe
                      </div>
                      <button
                        className="text-sm text-blue-300 underline"
                        onClick={() => {
                          setTribeSignedIn(false);
                          setTribeUser('');
                        }}
                      >
                        Switch Tribe / Logout
                      </button>
                    </div>
                    <div className="h-64 overflow-y-auto bg-black/30 rounded p-4 mb-4 text-left">
                      {tribeMessages[tribeSelected].length === 0 && (
                        <div className="text-gray-400 text-center">No messages yet. Start the conversation!</div>
                      )}
                      {tribeMessages[tribeSelected].map((msg, idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-bold text-blue-200">{msg.user}</span>
                          <span className="text-gray-400 text-xs ml-2">{msg.time}</span>
                          <div className="text-white">{msg.text}</div>
                        </div>
                      ))}
                    </div>
                    <form
                      onSubmit={(e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        if (!tribeText.trim()) return;
                        setTribeMessages(msgs => ({
                          ...msgs,
                          [tribeSelected]: [
                            ...msgs[tribeSelected],
                            {
                              user: tribeUser,
                              text: tribeText,
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            },
                          ],
                        }));
                        setTribeText('');
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 rounded bg-gray-700 text-white"
                        placeholder="Type a message..."
                        value={tribeText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTribeText(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-lotus text-white font-bold rounded hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </form>
                    {/* Video Forum */}
                    <div className="mt-8">
                      <h4 className="font-bold text-white mb-2">Tribe Video Forum</h4>
                      <form
                        className="flex flex-col gap-2 mb-4"
                        onSubmit={(e: FormEvent<HTMLFormElement>) => {
                          e.preventDefault();
                          if (!videoUrl.trim()) return;
                          setVideoForum(forum => ({
                            ...forum,
                            [tribeSelected]: [
                              ...forum[tribeSelected],
                              { user: tribeUser, url: videoUrl, comment: videoComment },
                            ],
                          }));
                          setVideoUrl('');
                          setVideoComment('');
                        }}
                      >
                        <input
                          type="url"
                          className="px-4 py-2 rounded bg-gray-700 text-white"
                          placeholder="YouTube or video URL"
                          value={videoUrl}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          className="px-4 py-2 rounded bg-gray-700 text-white"
                          placeholder="Comment (optional)"
                          value={videoComment}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setVideoComment(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-lotus text-white font-bold rounded hover:bg-blue-700 transition-colors"
                        >
                          Post Video
                        </button>
                      </form>
                      <div className="space-y-2">
                        {videoForum[tribeSelected] && videoForum[tribeSelected].length === 0 && (
                          <div className="text-gray-400">No videos posted yet.</div>
                        )}
                        {videoForum[tribeSelected] && videoForum[tribeSelected].map((v, idx) => (
                          <div key={idx} className="bg-black/40 p-2 rounded">
                            <div className="text-blue-200 font-bold">{v.user}</div>
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">
                              {v.url}
                            </a>
                            {v.comment && <div className="text-white">{v.comment}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Favorite Song */}
                    <div className="mt-8">
                      <h4 className="font-bold text-white mb-2">What's your favorite Red Lotus song?</h4>
                      <input
                        type="text"
                        className="px-4 py-2 rounded bg-gray-700 text-white mb-2"
                        placeholder="Favorite song"
                        value={favoriteSong}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFavoriteSong(e.target.value)}
                      />
                    </div>
                    {/* Tour Suggestion */}
                    <div className="mt-8">
                      <h4 className="font-bold text-white mb-2">Where would you like to see Red Lotus perform next?</h4>
                      <form
                        className="flex gap-2"
                        onSubmit={(e: FormEvent<HTMLFormElement>) => {
                          e.preventDefault();
                          if (!tourSuggestion.trim()) return;
                          setTourSuggestions(sugs => [
                            ...sugs,
                            { user: tribeUser, city: signupCity, tribe: tribeSelected, suggestion: tourSuggestion },
                          ]);
                          setTourSuggestion('');
                        }}
                      >
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 rounded bg-gray-700 text-white"
                          placeholder="City or Venue"
                          value={tourSuggestion}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setTourSuggestion(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-lotus text-white font-bold rounded hover:bg-blue-700 transition-colors"
                        >
                          Submit
                        </button>
                      </form>
                      <div className="mt-2 text-left">
                        {tourSuggestions.length === 0 && <div className="text-gray-400">No suggestions yet.</div>}
                        {tourSuggestions
                          .filter(s => s.tribe === tribeSelected)
                          .map((s, idx) => (
                            <div key={idx} className="text-white text-sm">
                              <span className="font-bold">{s.user}</span> ({s.city}): {s.suggestion}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Behind the Scenes Section */}
          <section id="behind-scenes" className={activeSection === 'behind-scenes' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
              <div className="flex flex-col w-full">
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={behindTheScenesMain} alt="Behind the Scenes Main" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={behindTheScenes2} alt="Behind the Scenes 2" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="w-full h-[40vw] min-h-[300px] relative">
                  <img src={behindTheScenes3} alt="Behind the Scenes 3" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              <div className="container mx-auto px-4 text-center mt-12">
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
          </section>

          {/* Music Store Section */}
          <section id="music-store" className={activeSection === 'music-store' ? 'block' : 'hidden'}>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-8 text-center text-white">THE MOST EXPENSIVE STORE</h2>
                <div className="text-center p-12">
                  <p className="text-gray-400 mb-4">No music available yet. Check back soon!</p>
                  <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center mx-auto max-w-md">
                    <img src={redLotusAlbumRap} alt="Red Lotus Album" className="w-40 h-40 object-cover rounded mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Red Lotus (Rap)</h3>
                    <p className="text-gray-300 mb-2">Available on music streaming platforms.</p>
                    <a
                      href="https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-lotus text-white px-4 py-2 rounded-full font-bold"
                      onClick={() => {
                        setSongClicks(sc => ({ ...sc, 'Red Lotus (Rap)': (sc['Red Lotus (Rap)'] || 0) + 1 }));
                        setTribeClicks(tc => ({ ...tc, red: tc.red + 1 }));
                      }}
                    >
                      Stream Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className={`p-6 text-center transition-colors duration-300 ease-in-out`}>
          <div className="container mx-auto">
            <img src={lotusForEachAlbum} alt="Red Lotus Logo" className="w-12 h-12 mx-auto mb-4" />
            <p className="mb-2">© {new Date().getFullYear()} Red Lotus Music. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://distrokid.com/hyperfollow/redlotus/lotus-the-red-album/" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity" aria-label="Stream Red Lotus Album">Stream</a>
              {/* Admin Login Nav */}
              <button
                onClick={() => setShowAdminLogin(true)}
                className="ml-4 px-4 py-2 rounded bg-blue-lotus text-white font-bold hover:bg-blue-700 transition-colors"
              >
                Artist Admin
              </button>
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
            <BandAuditionForm onSubmit={() => handleBandAuditionSubmit({ name: '', email: '', instrument: '', message: '' })} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;

