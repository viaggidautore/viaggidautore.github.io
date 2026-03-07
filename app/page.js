export default function ChatPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Viaggi d'Autori</h1>
      <p>Benvenuto! La tua chat con Gemini è in fase di configurazione.</p>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', maxWidth: '400px', margin: '0 auto' }}>
        <input type="text" placeholder="Scrivi qui..." style={{ width: '80%', padding: '10px' }} />
        <button style={{ padding: '10px' }}>Invia</button>
      </div>
    </div>
  );
}
