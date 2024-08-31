import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import './App.css'

const socket = io('ws://10.3.58.27:3000', {
  transports: ['websocket']
});

type message = {
  client: string,
  text: string
}

function App() {  
  const [userId, setUserId] = useState<string>('')
  const [messages, setMessages] = useState<message[]>([]);
  
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    
    socket.on('MESSAGE', (newMessage: message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage)
    });

    setUserId(socket.id || '')

    return () => {
      socket.off('MESSAGE');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('MESSAGE', message);
      setUserId(socket.id || '')
      setMessage('');
    }
  };

  return (
    <>
      <div className='largo'>
      <h1>Chat</h1>
      <div>
        <div className='mensagens'>
          {messages.map((msg: message, index) => {
            console.log(msg)
            console.log("user: " + userId)
            console.log("msg: " + msg.client)
            if(userId == msg.client){
            return (                        
              <div className='mensagem' key={index}>
                <div>
                  {msg.text}
                </div>
                </div>
            )
            }else{
              return (                        
                <div className='mensagem outrouser' style={{justifyContent: 'flex-start'}} key={index}><div>{msg.text}</div></div>
              )
            }
          })}
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
