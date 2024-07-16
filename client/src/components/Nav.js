import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Nav = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Vérifiez l'état de connexion de l'utilisateur
    axios.get('/user/profile')
      .then(response => {
        if (response.data.user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, []);

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/history">Listening History</Link></li>
        <li><Link to="/top10">Top</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li className="spotify-logo-container">
          <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">
            <img src="/spotify-logo.png" alt="Spotify Logo" className="spotify-logo" />
          </a>
        </li>
        <li style={{ float: 'right' }}>
          {loggedIn ? (
            <a href="http://localhost:5000/auth/logout" className="login-logout">Log out</a>
          ) : (
            <a href="http://localhost:5000/auth/spotify" className="login-logout">Log in</a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
