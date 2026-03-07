'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Errore di connessione...' }]);
    }
    setInput('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Viaggi d'Autori AI</h1>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', marginBottom: '10px', padding: '10px' }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'Tu: ' : 'Gemini: '}</strong>{msg.text}
          </p>
        ))}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        style={{ width: '80%', padding: '10px' }} 
        placeholder="Chiedi qualcosa..." 
      />
      <button onClick={sendMessage} style={{ padding: '10px' }}>Invia</button>
    </div>
  );
}
