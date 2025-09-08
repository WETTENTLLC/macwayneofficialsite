import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Assumes Firebase setup

interface Quote {
  id?: string;
  text: string;
  author: string;
  category: string;
  featured: boolean;
  createdAt: Date;
}

interface QuoteTextFieldProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const QuoteTextField: React.FC<QuoteTextFieldProps> = ({ text, setText }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Quote Text:</label>
    <textarea
      value={text}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
      required
      rows={4}
      className="w-full px-3 py-2 border rounded-md"
    />
  </div>
);

const AuthorInput: React.FC<{ author: string; setAuthor: React.Dispatch<React.SetStateAction<string>> }> = ({ author, setAuthor }) => (
  <div>
    <label className="block text-sm font-medium mb-1">Author:</label>
    <input
      type="text"
      value={author}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
      required
      className="w-full px-3 py-2 border rounded-md"
    />
  </div>
);

const QuoteManager: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quotes
  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedQuotes = querySnapshot.docs.map(doc => {
        return { 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        } as Quote;
      });
      setQuotes(fetchedQuotes);
    } catch (err: any) {
      setError('Error fetching quotes: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Add or update a quote
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingQuote) {
        // Update existing quote
        if (editingQuote.id) {
          await updateDoc(doc(db, 'quotes', editingQuote.id), {
            text,
            author,
            category,
            featured
          });
          
          // Reset form and editing state
          setEditingQuote(null);
          resetForm();
          
          // Refresh quotes
          fetchQuotes();
        }
      } else {
        // Add new quote
        const quoteData = {
          text,
          author,
          category,
          featured,
          createdAt: new Date()
        };
        
        await addDoc(collection(db, 'quotes'), quoteData);
        resetForm();
        fetchQuotes();
      }
    } catch (err: any) {
      setError('Error saving quote: ' + err.message);
    }
  };

  // Delete a quote
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteDoc(doc(db, 'quotes', id));
        fetchQuotes();
      } catch (err: any) {
        setError('Error deleting quote: ' + err.message);
      }
    }
  };

  // Edit a quote
  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setText(quote.text);
    setAuthor(quote.author);
    setCategory(quote.category);
    setFeatured(quote.featured);
  };

  // Reset form fields
  const resetForm = () => {
    setText('');
    setAuthor('');
    setCategory('');
    setFeatured(false);
  };

  // Toggle featured status
  const toggleFeatured = async (quote: Quote) => {
    if (!quote.id) return;
    
    try {
      await updateDoc(doc(db, 'quotes', quote.id), {
        featured: !quote.featured
      });
      fetchQuotes();
    } catch (err: any) {
      setError('Error updating quote: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Vibe Quotes Manager</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button 
            className="float-right"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Quote Form */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingQuote ? 'Edit Quote' : 'Add New Quote'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <QuoteTextField text={text} setText={setText} />
              <AuthorInput author={author} setAuthor={setAuthor} />
              <div>
                <label className="block text-sm font-medium mb-1">Category:</label>
                <select
                  value={category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="inspiration">Inspiration</option>
                  <option value="music">Music</option>
                  <option value="life">Life</option>
                  <option value="peace">Peace</option>
                  <option value="wisdom">Wisdom</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeatured(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured on homepage</label>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingQuote ? 'Update Quote' : 'Submit Quote'}
                </button>
                {editingQuote && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuote(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Quote List */}
        <div className="w-full md:w-2/3">
          <h3 className="text-xl font-semibold mb-4">Quotes</h3>
          
          {isLoading ? (
            <div className="text-center py-4">Loading quotes...</div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-lg">No quotes added yet</div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div 
                  key={quote.id} 
                  className={`p-4 border rounded-lg ${quote.featured ? 'bg-yellow-50 border-yellow-200' : 'bg-white'}`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">{quote.category}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => toggleFeatured(quote)}
                        className={`px-2 py-1 text-xs rounded ${
                          quote.featured 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quote.featured ? 'Featured' : 'Not Featured'}
                      </button>
                      <button
                        onClick={() => handleEdit(quote)}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => quote.id && handleDelete(quote.id)}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <blockquote className="mt-2 italic">"{quote.text}"</blockquote>
                  <p className="text-sm mt-1">— {quote.author}</p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Added: {quote.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Featured Quotes Preview</h3>
        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="space-y-6">
            {quotes.filter(quote => quote.featured).length === 0 ? (
              <p className="text-center text-gray-500">No featured quotes to display</p>
            ) : (
              quotes
                .filter(quote => quote.featured)
                .map((quote) => (
                  <div key={quote.id} className="text-center">
                    <blockquote className="text-xl italic">"{quote.text}"</blockquote>
                    <p className="mt-2">— {quote.author}</p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteManager;
