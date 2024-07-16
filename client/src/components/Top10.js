import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Top10.css';

const Top10 = () => {
  const [timeRange, setTimeRange] = useState('short_term');
  const [top10, setTop10] = useState([]);
  const [type, setType] = useState('trackName');
  const [loading, setLoading] = useState(false);
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
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await axios.get('/user/top10', {
            params: { timeRange, type }
          });

          setTop10(result.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [timeRange, type, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div className='error_connect'>Connect to have access to Spotify Review</div>;
  }

  return (
    <div className="top10-container">
      <h1>Top 50</h1>
      <div className="filters">
        <select className="filter-button" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="short_term">4 dernières semaines</option>
          <option value="medium_term">3 derniers mois</option>
          <option value="long_term">Depuis toujours</option>
        </select>
        <select className="filter-button" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="trackName">Musique</option>
          <option value="artistName">Artiste</option>
        </select>
      </div>
      {!loading && !error && (
        <table className="top10-table">
          <thead>
            <tr>
              <th>Top</th>
              {type === 'trackName' && (
                <>
                  <th>Musique</th>
                  <th>Artiste</th>
                  <th>Cover</th>
                </>
              )}
              {type === 'artistName' && (
                <>
                  <th>Artiste</th>
                  <th>Cover</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {top10.map((item, index) => (
              <tr key={index}>
                <td className="top-ranking">{index + 1}</td>
                {type === 'trackName' && (
                  <>
                    <td className="text-center">{item.trackName}</td>
                    <td className="text-center">{item.artistName}</td>
                    <td className="cover-cell"><img src={item.albumImageUrl} alt={item.trackName} className="cover-image" /></td>
                  </>
                )}
                {type === 'artistName' && (
                  <>
                    <td className="text-center">{item.artistName}</td>
                    <td className="cover-cell"><img src={item.artistImageUrl} alt={item.artistName} className="cover-image" /></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Top10;
