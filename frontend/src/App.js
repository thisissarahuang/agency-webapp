import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConcertList from './views/ConcertList';
import AddConcertForm from './views/AddConcertForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConcertList />} />
        <Route path="/add-concert" element={<AddConcertForm />} />
      </Routes>
    </Router>
  );
}

export default App;