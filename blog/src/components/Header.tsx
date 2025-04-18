import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-xl font-bold mb-4 md:mb-0">
          Blockchain & Web Dev Bootcamp
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className={`hover:text-blue-300 transition-colors ${
                  location.pathname === '/' ? 'text-blue-400 font-semibold' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/new"
                className={`hover:text-blue-300 transition-colors ${
                  location.pathname === '/new' ? 'text-blue-400 font-semibold' : ''
                }`}
              >
                New Lecture
              </Link>
            </li>
            <li>
              <Link
                to="/archive"
                className={`hover:text-blue-300 transition-colors ${
                  location.pathname === '/archive' ? 'text-blue-400 font-semibold' : ''
                }`}
              >
                Archive
              </Link>
            </li>
            <li>
              <Link
                to="/notes"
                className={`hover:text-blue-300 transition-colors ${
                  location.pathname === '/notes' ? 'text-blue-400 font-semibold' : ''
                }`}
              >
                My Notes
              </Link>
            </li>
            <li>
              <Link
                to="/nft-studio"
                className={`hover:text-blue-300 transition-colors ${
                  location.pathname === '/nft-studio' ? 'text-blue-400 font-semibold' : ''
                }`}
              >
                NFT Studio
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;