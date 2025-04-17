import { useState } from 'react';

interface BandAuditionFormProps {
  onSubmit: () => void;
}

export default function BandAuditionForm({ onSubmit }: BandAuditionFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [instrument, setInstrument] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !instrument) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Call the onSubmit function passed as prop
    onSubmit();
    
    // Reset form
    setName('');
    setEmail('');
    setInstrument('');
    setExperience('');
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name*
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email*
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">
          Instrument/Skill*
        </label>
        <select
          id="instrument"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          required
        >
          <option value="">Select your primary skill</option>
          <option value="vocals">Vocals</option>
          <option value="guitar">Guitar</option>
          <option value="bass">Bass</option>
          <option value="drums">Drums</option>
          <option value="keys">Keys/Piano</option>
          <option value="production">Production</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
          Years of Experience
        </label>
        <input
          type="number"
          id="experience"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Why do you want to join Red Lotus?
        </label>
        <textarea
          id="message"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Submit Audition
        </button>
      </div>
    </form>
  );
}
