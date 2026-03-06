import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importando da pasta components conforme sua estrutura atual
import Home from './components/Home';
import GerenciadorAbrigoAnimais from './components/GerenciadorAbrigoAnimais';
import GerenciarVacinas from './components/GerenciarVacinas';
import GerenciarAdotante from './components/GerenciarAdotante';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animais" element={<GerenciadorAbrigoAnimais />} />
        <Route path="/vacinas" element={<GerenciarVacinas />} />
        <Route path="/adotantes" element={<GerenciarAdotante />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;