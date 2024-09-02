import { useState, useEffect, useRef } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Chat from './pages/Chat';

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if(name != ""){
      navigate(`/Chat?name=${encodeURIComponent(name)}`);
    }else{
      alert("Nome invalido!")
    }
  }
  ;
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Diga seu nome</h1>
      <form onSubmit={handleSubmit} style={{display: 'flex',flexDirection: 'column'}}>
        <input
        style={{          
          paddingInline: 15,
          paddingTop: 5,
          paddingBottom: 5,
          fontSize: 20,
          marginBottom: 15
        }}
          type="text"
          value={name}
          onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
          placeholder="Nome"
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

function App() {  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Chat" element={<Chat />} />
    </Routes>
  </Router>   
  )
}

export default App
