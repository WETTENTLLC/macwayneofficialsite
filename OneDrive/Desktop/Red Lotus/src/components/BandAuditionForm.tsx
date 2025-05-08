import React, { FormEvent, useState } from 'react';

interface BandAuditionFormProps {
  onSubmit: (form: { name: string; email: string; instrument: string; message: string }) => void;
}

const BandAuditionForm: React.FC<BandAuditionFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [instrument, setInstrument] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, instrument, message });
    // Reset form 
    setName('');
    setEmail('');
    setInstrument('');
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="name"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-lotus"
          placeholder="Your name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-lotus"
          placeholder="Your email address"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-1">Instrument</label>
        <select
          id="instrument"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-lotus"
          value={instrument}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInstrument(e.target.value)}
          required
        >
          <option value="">Select your instrument</option>
          <option value="Vocals">Vocals</option>
          <option value="Guitar">Guitar</option>
          <option value="Bass">Bass</option>
          <option value="Drums">Drums</option>
          <option value="Keyboard">Keyboard</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
        <textarea
          id="message"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-lotus"
          placeholder="Tell us about your music experience and why you'd like to join Red Lotus"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          rows={4}
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 bg-red-lotus text-white font-bold rounded-md hover:bg-red-800 transition-colors duration-300"
      >
        Submit Audition
      </button>
    </form>
  );
};

export default BandAuditionForm;
