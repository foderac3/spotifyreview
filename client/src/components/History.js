import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Top10.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await axios.get('/user/profile');
        setUser(result.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await axios.get('/user/recent-history');
          setHistory(result.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div className='error_connect'>Connect to have access to Spotify Review</div>;
  }

  if (!Array.isArray(history) || history.length === 0) {
    return <div>No history data available.</div>;
  }

  return (
    <div className="top10-container">
      <h1>Listening History</h1>
      <table className="top10-table">
        <thead>
          <tr>
            <th>Track Name</th>
            <th>Artist Name</th>
            <th>Album Name</th>
            <th>Played At</th>
            <th>Cover</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{item.trackName}</td>
              <td>{item.artistName}</td>
              <td>{item.albumName}</td>
              <td>{new Date(item.playedAt).toLocaleString()}</td>
              <td className="cover-cell"><img src={item.albumImageUrl} alt={item.trackName} className="cover-image" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
