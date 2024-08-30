import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import './App.css'

const socket = io('ws://10.3.32.27:3000', {
  transports: ['websocket']
});

function App() {  

  const [messages, setMessages] = useState<string[]>([]);
  
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    
    socket.on('MESSAGE', (newMessage: string) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('MESSAGE');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('MESSAGE', message);
      setMessage('');
    }
  };

  return (
    <>
      <div>
      <h1>Chat</h1>
      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
    </>
  )
}

export default App
