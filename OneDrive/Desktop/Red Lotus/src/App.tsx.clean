import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
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
        min={m.videoPrice || 1}
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
          Thank you! <a href={m.videoUrl} download className="underline">Download Now</a>
        </div>
      )}
    </form>
  );
}

function App() {
  const { currentUser, loading } = useAuth();
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

  // Continue with the rest of your existing code...
  // ...

  // Code at the end of your App component
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If we're on paths that should use the router instead of the original content
  if (window.location.pathname === '/login' || window.location.pathname === '/admin') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={currentUser ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    );
  }

  // For all other paths, show the original content with the original layout
  return (
    <div className="App">
      {/* Your original layout code here */}
      {/* ... */}
    </div>
  );
}

export default App;
