// Simple test component to verify React is working
function AppTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Backend URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</p>
    </div>
  )
}

export default AppTest
