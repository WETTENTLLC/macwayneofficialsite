import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

const Home: React.FC = () => {
  const [featuredQuote, setFeaturedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedQuote = async () => {
      try {
        const q = query(
          collection(db, 'quotes'), 
          where('featured', '==', true),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const quoteDoc = querySnapshot.docs[0];
          setFeaturedQuote({
            id: quoteDoc.id,
            ...quoteDoc.data() as Omit<Quote, 'id'>
          });
        }
      } catch (error) {
        console.error('Error fetching featured quote:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedQuote();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-red-lotus text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Red Lotus</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Official music collective. Experience the sound.
            </p>
          </div>
        </section>
        
        {/* Featured Quote */}
        {!loading && featuredQuote && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-2xl md:text-3xl italic text-gray-700">
                "{featuredQuote.text}"
              </blockquote>
              <p className="mt-4 text-xl text-red-lotus">— {featuredQuote.author}</p>
            </div>
          </section>
        )}
        
        {/* Other home page sections */}
        {/* ... */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
