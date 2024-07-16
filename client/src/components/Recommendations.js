import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendation, setRecommendation] = useState(null);
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
      const fetchRecommendation = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await axios.get('/user/recommendations');
          setRecommendation(result.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendation();
    }
  }, [user]);

  const fetchNewRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.get('/user/recommendations');
      setRecommendation(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div className='error_connect'>Connect to have access to Spotify Review</div>;
  }

  if (!recommendation) {
    return <div>No recommendations available.</div>;
  }

  return (
    <div className="recommendation-container">
      <h1>Music Recommendation</h1>
      <div className="recommendation-card">
        <img src={recommendation.albumImageUrl} alt={recommendation.trackName} className="cover-image2" />
        <h2>{recommendation.trackName}</h2>
        <h3>{recommendation.artistName}</h3>
        <p>{recommendation.albumName}</p>
        <div className="actions">
          <button onClick={fetchNewRecommendation} className="next-button">Next</button>
        </div>
        <div className="track_">
          <br></br>
          <iframe className="track"
            src={`https://open.spotify.com/embed/track/${recommendation.trackUri.split(':')[2]}`} 
            width="300" 
            height="80" 
            frameBorder="0" 
            allowtransparency="true" 
            allow="encrypted-media"
            title={`Spotify player for ${recommendation.trackName}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
