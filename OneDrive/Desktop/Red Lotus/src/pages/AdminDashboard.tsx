import React, { useState, useEffect } from 'react';
import MediaUploader from '../components/upload/MediaUploader';
import MessageManager from '../features/messaging/MessageManager';
import QuoteManager from '../features/vibration/QuoteManager';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'media' | 'messages' | 'quotes'>('media');
  const [user, loading, error] = useAuthState(auth);
  const [uploadedSongs, setUploadedSongs] = useState<any[]>([]);

  const fetchUploadedSongs = async () => {
    const querySnapshot = await getDocs(collection(db, 'songs'));
    const songs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUploadedSongs(songs);
  };

  useEffect(() => {
    fetchUploadedSongs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-lotus"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login or show login form
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-red-lotus text-center">Artist Admin Access</h2>
          <p className="mb-4 text-center">Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full py-2 px-4 bg-red-lotus text-white rounded-md hover:bg-opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-lotus text-white shadow-md">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Red Lotus Admin</h1>
            <button 
              onClick={() => auth.signOut()}
              className="px-4 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-6 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b overflow-x-auto scrollbar-hide">
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'media' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('media')}
            >
              Media Upload
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'messages' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
            </button>
            <button 
              className={`py-4 px-6 text-center flex-grow ${activeTab === 'quotes' ? 'bg-red-lotus text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab('quotes')}
            >
              Vibe Quotes
            </button>
          </div>
          
          <div className="p-4">
            {activeTab === 'media' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Images</h3>
                  <MediaUploader 
                    mediaType="image" 
                    folder="images" 
                    onComplete={(url) => console.log('Image uploaded:', url)} 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Music</h3>
                  <MediaUploader 
                    mediaType="audio" 
                    folder="music" 
                    onComplete={async (url, metadata) => {
                      console.log('Audio uploaded:', url, metadata);
                      await addDoc(collection(db, 'store'), { 
                        url, 
                        metadata, 
                        type: 'audio', 
                        price: metadata.price || 0 
                      });
                      fetchUploadedSongs();
                    }} 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Videos</h3>
                  <MediaUploader 
                    mediaType="video" 
                    folder="videos" 
                    onComplete={async (url, metadata) => {
                      console.log('Video uploaded:', url, metadata);
                      await addDoc(collection(db, 'store'), { 
                        url, 
                        metadata, 
                        type: 'video', 
                        price: metadata.price || 0 
                      });
                    }} 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Uploaded Songs</h3>
                  <ul>
                    {uploadedSongs.length === 0 ? (
                      <li>No songs uploaded yet.</li>
                    ) : (
                      uploadedSongs.map(song => (
                        <li key={song.id}>{song.metadata.title || song.metadata.name}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'messages' && <MessageManager />}
            
            {activeTab === 'quotes' && <QuoteManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
