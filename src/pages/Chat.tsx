import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../App.css'

const socket = io('ws://192.168.15.18:3000', {
    transports: ['websocket']
});

type message = {
    client: string,
    text: string,
    name: string,
}

function Chat() {
    const [userId, setUserId] = useState<string>('')
    const [messages, setMessages] = useState<message[]>([]);
    const [message, setMessage] = useState<string>('');
    const chatContainerRef = useRef(null);

    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get("name");

    useEffect(() => {

        socket.emit("NAME", name)

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

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer != null) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className='largo'>
                <h1>Chat</h1>
                <div>
                    <div className='mensagens' ref={chatContainerRef}>
                        {messages.map((msg: message, index) => {
                            console.log(msg)
                            console.log("user: " + userId)
                            console.log("msg: " + msg.client)
                            if (userId == msg.client) {
                                return (
                                    <div className='mensagem' key={index}>
                                        <div>                                            
                                            {msg.text}
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className='mensagem outrouser' style={{ justifyContent: 'flex-start' }} key={index}>
                                        <div>
                                            <p className='userName'>{msg.name}</p>
                                            {msg.text}
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <input
                        type="text"
                        value={message}
                        className='inputMessage'
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage()
                            }
                        }}
                    />
                    <button onClick={sendMessage} className='sendButton'><FontAwesomeIcon icon={faPaperPlane} /></button>
                </div>
            </div>
        </>
    )
}

export default Chat
