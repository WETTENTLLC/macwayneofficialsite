export default function TestRoute() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#222', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Test Route Working!</h1>
      <p style={{ fontSize: '1.5rem' }}>If you can see this, routing is working properly.</p>
      <p style={{ marginTop: '20px' }}>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
