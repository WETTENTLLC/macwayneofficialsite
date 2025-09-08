import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, addDoc, getDoc, DocumentReference } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

// Types
export interface LiveShow {
  id: string;
  title: string;
  date: string;
  price: number;
  description: string;
  streamUrl?: string;
  previewImageUrl?: string;
  isActive: boolean;
}

export interface LiveTicket {
  id: string;
  showId: string;
  userId: string;
  userEmail: string;
  purchaseDate: Date;
  amount: number;
  status: 'active' | 'used' | 'expired';
  accessCode: string;
}

// Hook for managing user access to live shows
const useLiveShowAccess = () => {
  const { currentUser } = useAuth();
  const [userTickets, setUserTickets] = useState<LiveTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!currentUser) {
        setUserTickets([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const ticketsQuery = query(
          collection(db, 'liveTickets'),
          where('userId', '==', currentUser.uid)
        );

        const ticketsSnapshot = await getDocs(ticketsQuery);
        const tickets: LiveTicket[] = [];
        
        ticketsSnapshot.forEach((doc) => {
          const data = doc.data() as Omit<LiveTicket, 'id'> & { purchaseDate: any };
          tickets.push({
            id: doc.id,
            ...data,
            purchaseDate: data.purchaseDate instanceof Date 
              ? data.purchaseDate 
              : (data.purchaseDate && typeof data.purchaseDate.seconds === 'number')
                ? new Date(data.purchaseDate.seconds * 1000)
                : new Date()
          });
        });

        setUserTickets(tickets);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user tickets:", err);
        setError("Failed to load your tickets. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUserTickets();
  }, [currentUser]);
  return {
    userTickets,
    isLoading,
    error
  };
};

// Create a component that uses the hook
const LiveShowAccessManager: React.FC = () => {
  const { userTickets, isLoading, error } = useLiveShowAccess();
  
  if (isLoading) {
    return <div>Loading your tickets...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  
  return (
    <div>
      <h2>Your Tickets</h2>
      {userTickets.length === 0 ? (
        <p>You don't have any tickets yet.</p>
      ) : (
        <ul>
          {userTickets.map(ticket => (
            <li key={ticket.id}>Show ID: {ticket.showId} - Code: {ticket.accessCode}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Functions for interacting with live show tickets
export const purchaseLiveShowTicket = async (
  showId: string,
  userEmail: string,
  userName: string,
  amount: number
): Promise<LiveTicket> => {
  try {
    // Generate a unique access code (simplified for demo)
    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create a new ticket document
    const ticketData: Omit<LiveTicket, 'id'> = {
      showId,
      userId: userEmail, // Using email as userId for non-authenticated users
      userEmail,
      purchaseDate: new Date(),
      amount,
      status: 'active',
      accessCode
    };

    // Add to Firestore
    const ticketRef = await addDoc(collection(db, 'liveTickets'), ticketData);
    
    // Update the analytics
    await incrementLiveShowStats(showId, amount);
    
    return {
      id: ticketRef.id,
      ...ticketData
    };
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    throw new Error("Failed to purchase ticket. Please try again.");
  }
};

export const checkTicketAccess = async (showId: string, accessCode: string): Promise<boolean> => {
  try {
    // Query for tickets with matching show ID and access code
    const ticketsQuery = query(
      collection(db, 'liveTickets'),
      where('showId', '==', showId),
      where('accessCode', '==', accessCode),
      where('status', '==', 'active')
    );
    
    const ticketSnapshot = await getDocs(ticketsQuery);
    return !ticketSnapshot.empty;
  } catch (error) {
    console.error("Error checking ticket access:", error);
    return false;
  }
};

// Analytics tracking for live shows
const incrementLiveShowStats = async (showId: string, amount: number) => {
  try {
    const statsRef = doc(db, 'analytics', 'liveShows');
    const statsDoc = await getDoc(statsRef);
    
    if (statsDoc.exists()) {
      const currentStats = statsDoc.data() as Record<string, any>;
      const showStats = currentStats[showId] || { tickets: 0, revenue: 0 };
      
      await setDoc(statsRef, {
        ...currentStats,
        [showId]: {
          tickets: showStats.tickets + 1,
          revenue: showStats.revenue + amount
        }
      });
    } else {
      await setDoc(statsRef, {
        [showId]: {
          tickets: 1,
          revenue: amount
        }
      });
    }
  } catch (error) {
    console.error("Error updating live show stats:", error);
  }
};

export default LiveShowAccessManager;
