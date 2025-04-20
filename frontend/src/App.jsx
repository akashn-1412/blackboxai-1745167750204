import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Gallery from './pages/Gallery';
import PhotoDetails from './pages/PhotoDetails';
import Comparison from './pages/Comparison';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/photo/:id" element={<PhotoDetails />} />
        <Route path="/compare" element={<Comparison />} />
      </Routes>
    </div>
  );
}

export default App;
