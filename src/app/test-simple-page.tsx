'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#222', 
      color: '#fff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Mac Wayne Homepage</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>This is a simplified version for testing routing</p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/test-route" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#cc0000', 
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Test Route
        </Link>
        
        <Link href="/shop" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0066cc', 
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Shop Page
        </Link>
      </div>
      
      <p style={{ marginTop: '50px' }}>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
