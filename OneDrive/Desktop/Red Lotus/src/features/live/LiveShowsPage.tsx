import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { LiveShow, purchaseLiveShowTicket } from './LiveShowAccessManager';
import LiveShowPlayer from './LiveShowPlayer';
import { trackMusicInteraction } from '../analytics/AnalyticsService';

interface LiveShowsPageProps {
  isAdmin?: boolean;
}

const LiveShowsPage: React.FC<LiveShowsPageProps> = ({ isAdmin = false }) => {
  const [liveShows, setLiveShows] = useState<LiveShow[]>([]);
  const [selectedShow, setSelectedShow] = useState<LiveShow | null>(null);
  const [liveAmount, setLiveAmount] = useState<number>(10);
  const [livePaymentSuccess, setLivePaymentSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isStreamMode, setIsStreamMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Merchandise items for the concession stand
  const [liveMerch, setLiveMerch] = useState([
    { id: 'm1', name: 'Red Lotus T-Shirt', price: 25 },
    { id: 'm2', name: 'Digital Album Download', price: 12 },
    { id: 'm3', name: 'Concert Poster', price: 15 },
    { id: 'm4', name: 'VIP Meet & Greet Add-on', price: 50 },
  ]);
  const [selectedMerch, setSelectedMerch] = useState<string[]>([]);

  useEffect(() => {
    const fetchLiveShows = async () => {
      try {
        setIsLoading(true);
        
        // If admin, show all shows, otherwise only show active ones
        const showsQuery = isAdmin 
          ? query(collection(db, 'liveShows'))
          : query(collection(db, 'liveShows'), where('isActive', '==', true));
          
        const showsSnapshot = await getDocs(showsQuery);
        const fetchedShows: LiveShow[] = [];
        
        showsSnapshot.forEach((doc) => {
          fetchedShows.push({
            id: doc.id,
            ...doc.data() as Omit<LiveShow, 'id'>
          });
        });
        
        setLiveShows(fetchedShows);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching live shows:", err);
        setError("Failed to load live shows. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchLiveShows();
  }, [isAdmin]);

  const handlePurchaseTicket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedShow) return;
    
    try {
      // Calculate total with selected merchandise
      const merchTotal = selectedMerch.reduce((total, id) => {
        const item = liveMerch.find(m => m.id === id);
        return total + (item ? item.price : 0);
      }, 0);
      
      const totalAmount = liveAmount + merchTotal;
      
      // Purchase the ticket
      const ticket = await purchaseLiveShowTicket(
        selectedShow.id,
        userEmail,
        userName,
        totalAmount
      );
      
      // Track the purchase in analytics
      await trackMusicInteraction(selectedShow.id, 'purchase', totalAmount);
      
      // Show success message and access code
      setLivePaymentSuccess(true);
      setAccessCode(ticket.accessCode);
      
      // Reset form
      setTimeout(() => {
        setLivePaymentSuccess(false);
        if (ticket.accessCode) {
          // Enter stream mode if we have an access code
          setIsStreamMode(true);
        }
      }, 2000);
    } catch (err) {
      console.error("Error purchasing ticket:", err);
      setError("Failed to process your ticket purchase. Please try again.");
    }
  };

  const exitStreamMode = () => {
    setIsStreamMode(false);
    setAccessCode('');
    setSelectedShow(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-yellow-lotus text-xl">
          Loading live shows...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-black/50 rounded-lg text-center">
        <div className="text-red-500 font-bold">
          {error}
        </div>
        <button 
          onClick={() => setError(null)} 
          className="mt-4 px-4 py-2 bg-blue-lotus text-white rounded hover:bg-yellow-lotus hover:text-black"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show the stream if we're in stream mode and have a selected show and access code
  if (isStreamMode && selectedShow && accessCode) {
    return (
      <div className="relative w-full max-w-4xl mx-auto p-4">
        <button
          className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white rounded hover:bg-red-600 transition-colors"
          onClick={exitStreamMode}
        >
          Exit Stream
        </button>
        
        <LiveShowPlayer 
          show={selectedShow}
          accessCode={accessCode}
          onInvalidAccess={exitStreamMode}
        />
      </div>
    );
  }

  // Display access code entry for users who already have a ticket
  const handleAccessCodeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedShow && accessCode) {
      setIsStreamMode(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Theater Section */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-2 text-yellow-lotus tracking-widest">Red Lotus LIVE</h2>
        <div className="mb-4 text-lg text-blue-200">Welcome to the Futuristic Lotus Theater</div>
        
        {/* Already have a ticket section */}
        {!selectedShow && (
          <div className="w-full bg-black/60 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-yellow-lotus mb-2">Already have a ticket?</h3>
            <form onSubmit={handleAccessCodeSubmit} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">              <select 
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                  value={selectedShow?.id || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const show = liveShows.find(s => s.id === e.target.value);
                    setSelectedShow(show || null);
                  }}
                  required
                >
                  <option value="">Select a show</option>
                  {liveShows.map(show => (
                    <option key={show.id} value={show.id}>
                      {show.title} - {show.date}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">                <input
                  type="text"
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessCode(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-lotus text-white font-bold rounded hover:bg-yellow-lotus hover:text-black transition-colors"
              >
                Access Stream
              </button>
            </form>
          </div>
        )}
        
        <div className="w-full flex flex-col items-center mb-6">
          <div className="w-full bg-gradient-to-r from-red-lotus via-yellow-lotus to-blue-lotus rounded-lg p-4 shadow-lg">
            <h3 className="text-2xl font-bold mb-2 text-black">Upcoming Shows</h3>
            {liveShows.length === 0 ? (
              <p className="text-center py-4 text-white bg-black/50 rounded">No upcoming shows at this time.</p>
            ) : (
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
                        className={`px-3 py-1 rounded ${selectedShow?.id === show.id ? 'bg-yellow-lotus text-black' : 'bg-blue-lotus text-white'} font-bold hover:bg-yellow-lotus hover:text-black transition-colors`}
                        onClick={() => setSelectedShow(show)}
                      >
                        {selectedShow?.id === show.id ? 'Selected' : 'Get Ticket'}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Theater Seats visualization */}
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
        {selectedShow && !isStreamMode && (
          <div className="w-full flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col items-center">
              <form
                className="w-full flex flex-col items-center gap-4 mb-4 bg-black/60 p-4 rounded-lg"
                onSubmit={handlePurchaseTicket}
              >
                <h3 className="text-xl font-bold text-yellow-lotus">Purchase Ticket for {selectedShow.title}</h3>
                
                <div className="w-full">
                  <label className="block text-blue-200 mb-1">Your Name</label>                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                    value={userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-blue-200 mb-1">Email Address</label>                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                    value={userEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-blue-200 mb-1">
                    Pay What You Want (${selectedShow.price} - $8000)
                  </label>
                  <input
                    type="number"
                    min={selectedShow.price}
                    max={8000}
                    value={liveAmount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLiveAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-lotus text-black font-bold rounded hover:bg-blue-lotus hover:text-white transition-colors"
                >
                  Pay & Reserve Seat
                </button>
                
                {livePaymentSuccess && (
                  <div className="text-green-400 font-bold mt-2 text-center">
                    <p>Thank you! Your seat is reserved.</p>
                    <p>Your access code: <span className="text-yellow-lotus">{accessCode}</span></p>
                    <p className="text-sm mt-1">Keep this code to access the stream when it begins.</p>
                  </div>
                )}
              </form>
            </div>
            
            {/* Concession Stand */}
            <div className="flex-1 flex flex-col items-center">
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
                {selectedMerch.length > 0 && (
                  <div className="mt-4 p-2 bg-blue-lotus/30 rounded">
                    <h4 className="font-bold text-yellow-lotus">Selected Items:</h4>
                    <ul>
                      {selectedMerch.map(id => {
                        const item = liveMerch.find(m => m.id === id);
                        return item ? (
                          <li key={id} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>${item.price}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-white/20 flex justify-between font-bold">
                      <span>Merchandise Total:</span>
                      <span>${selectedMerch.reduce((total, id) => {
                        const item = liveMerch.find(m => m.id === id);
                        return total + (item ? item.price : 0);
                      }, 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveShowsPage;
