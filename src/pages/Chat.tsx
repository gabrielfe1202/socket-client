import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "../App.css";

const socket = io("ws://192.168.15.18:3000", {
  transports: ["websocket"],
});

type message = {
  client: string;
  text: string;
  name: string;
  type: string;
};

function Chat() {
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);
  const [message, setMessage] = useState<string>("");
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get("name");
  const room = queryParams.get("room");
  

  useEffect(() => {    

    socket.emit("JOIN", { room, name });

    socket.on("MESSAGE", (newMessage: message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log(newMessage);
    });

    socket.on("previousMessages", (msg: message[]) => {      
      setMessages(msg)
    })

    setUserId(socket.id || "");

    return () => {
      socket.off("MESSAGE");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("MESSAGEROOM", message);
      setUserId(socket.id || "");
      setMessage("");
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom")
    navigate(`/`);
  }

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer != null) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="largo">
        <button
          style={{
            position: "absolute",
            top: 15,
            left: 15
          }}
          onClick={leaveRoom}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>Sala <span style={{color: 'rgb(255,113,113)'}}>{room}</span></h1>
        <div>
          <div className="mensagens" ref={chatContainerRef}>
            {messages.map((msg: message, index) => {
              console.log(msg);
              console.log("user: " + msg.name);
              if (msg.type == "Message") {
                if (userId == msg.client) {
                  return (
                    <div className="mensagem" key={index}>
                      <div>{msg.text}</div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="mensagem outrouser"
                      style={{ justifyContent: "flex-start" }}
                      key={index}
                    >
                      <div>
                        <p className="userName">{msg.name}</p>
                        {msg.text}
                      </div>
                    </div>
                  );
                }
              } else {
                return (
                  <div className="notification">
                    <p style={{ fontSize: 25, color: '#fff', margin: 0, padding: 0 }}>{msg.text}</p>
                  </div>
                )
              }
            })}
          </div>
          <input
            type="text"
            value={message}
            className="inputMessage"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} className="sendButton">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
