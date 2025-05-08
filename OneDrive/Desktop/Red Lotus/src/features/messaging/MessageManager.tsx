import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Assumes Firebase setup
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Message {
  id?: string;
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  createdAt: Timestamp;
  scheduledFor?: Timestamp | null;
  read: boolean;
}

const MessageManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'scheduled'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [scheduledMessages, setScheduledMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Fetch messages for inbox
  useEffect(() => {
    const userEmail = 'artist@redlotus.com'; // Replace with actual logged-in user
    
    // Query for received messages
    const q = query(
      collection(db, 'messages'),
      where('recipient', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt,
          scheduledFor: data.scheduledFor || null
        } as Message;
      });
      
      setMessages(fetchedMessages);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch scheduled messages
  useEffect(() => {
    const userEmail = 'artist@redlotus.com'; // Replace with actual logged-in user
    
    const q = query(
      collection(db, 'messages'),
      where('sender', '==', userEmail),
      where('scheduledFor', '>', Timestamp.now()),
      orderBy('scheduledFor', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt,
          scheduledFor: data.scheduledFor 
        } as Message;
      });
      
      setScheduledMessages(fetchedMessages);
    });
    
    return () => unsubscribe();
  }, []);

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      read: true
    });
  };

  // Send a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const messageData: Omit<Message, 'id'> = {
        subject,
        content,
        sender: 'artist@redlotus.com', // Replace with actual user
        recipient,
        createdAt: Timestamp.now(),
        read: false,
      };
      
      if (scheduledDate && scheduledDate > new Date()) {
        messageData.scheduledFor = Timestamp.fromDate(scheduledDate);
      }
      
      await addDoc(collection(db, 'messages'), messageData);
      
      // Reset form
      setSubject('');
      setContent('');
      setRecipient('');
      setScheduledDate(null);
      
      alert('Message ' + (scheduledDate ? 'scheduled' : 'sent') + ' successfully!');
    } catch (error) {
      console.error("Error sending message: ", error);
      alert('Failed to send message.');
    }
  };

  // View a message
  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.id && !message.read) {
      markAsRead(message.id);
    }
  };

  // Render tabs and content
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'inbox' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('inbox')}
        >
          Inbox
        </button>
        <button 
          className={`py-2 px-4 mr-2 ${activeTab === 'compose' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('compose')}
        >
          Compose
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'scheduled' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled
        </button>
      </div>
      
      {/* Inbox */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow p-6">
              <button 
                className="text-blue-600 mb-4"
                onClick={() => setSelectedMessage(null)}
              >
                ← Back to inbox
              </button>
              <div className="mb-4 pb-4 border-b">
                <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                <p className="text-sm text-gray-600">From: {selectedMessage.sender}</p>
                <p className="text-sm text-gray-600">
                  Date: {selectedMessage.createdAt.toDate().toLocaleString()}
                </p>
              </div>
              <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              {messages.length === 0 ? (
                <p className="text-gray-600">No messages in your inbox</p>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${message.read ? 'bg-white' : 'bg-blue-50'}`}
                    onClick={() => viewMessage(message)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${!message.read && 'font-bold'}`}>{message.subject}</h3>
                      <span className="text-xs text-gray-500">
                        {message.createdAt.toDate().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">From: {message.sender}</p>
                    <p className="text-sm mt-2 text-gray-700 truncate">{message.content}</p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
      
      {/* Compose */}
      {activeTab === 'compose' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Compose Message</h2>
          <form onSubmit={sendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">To:</label>
              <input 
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subject:</label>
              <input 
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Message:</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 border rounded-md"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Schedule (optional):</label>
              <DatePicker
                selected={scheduledDate}
                onChange={(date) => setScheduledDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Click to schedule"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {scheduledDate ? 'Schedule Message' : 'Send Message'}
            </button>
          </form>
        </div>
      )}
      
      {/* Scheduled Messages */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Scheduled Messages</h2>
          
          {scheduledMessages.length === 0 ? (
            <p className="text-gray-600">No scheduled messages</p>
          ) : (
            scheduledMessages.map((message) => (
              <div 
                key={message.id} 
                className="p-4 border rounded-lg bg-white"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{message.subject}</h3>
                  <span className="text-xs text-gray-500">
                    Created: {message.createdAt.toDate().toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">To: {message.recipient}</p>
                <p className="text-sm mt-1 text-green-700">
                  Scheduled for: {message.scheduledFor?.toDate().toLocaleString()}
                </p>
                <p className="text-sm mt-2 text-gray-700 truncate">{message.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MessageManager;
