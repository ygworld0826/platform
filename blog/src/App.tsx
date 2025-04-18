import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import Home from './pages/Home';
import NewLecture from './pages/NewLecture';
import Archive from './pages/Archive';
import Lecture from './pages/Lecture';
import EditLecture from './pages/EditLecture';
import AllNotes from './pages/AllNotes';
import NFTStudio from './pages/NFTStudio';

import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewLecture />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/lecture/:id" element={<Lecture />} />
            <Route path="/edit/:id" element={<EditLecture />} />
            <Route path="/notes" element={<AllNotes />} />
            <Route path="/nft-studio" element={<NFTStudio />} />
          </Routes>
        </main>
        <footer className="bg-white mt-12 py-6 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Blockchain & Web Development Bootcamp Platform &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;