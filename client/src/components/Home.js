import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [showReleases, setShowReleases] = useState({});

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
      const fetchFavoriteArtists = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await axios.get('/user/favorite-artists');
          setFavoriteArtists(result.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFavoriteArtists();
    }
  }, [user]);

  const handleSearch = async () => {
    if (!artistName) {
      setError('Veuillez entrer un nom d\'artiste');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await axios.get(`/user/search-artist?name=${artistName}`);
      setSearchResults(result.data.artists.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArtist = async (artist) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/user/add-artist', { artist });
      setSelectedArtist(artist);
      setSearchResults([]); // Clear search results
      // Refresh favorite artists
      const result = await axios.get('/user/favorite-artists');
      setFavoriteArtists(result.data);
    } catch (err) {
      setError(err.response.data.details || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveArtist = async (spotifyId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/user/remove-artist/${spotifyId}`);
      // Refresh favorite artists
      const result = await axios.get('/user/favorite-artists');
      setFavoriteArtists(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleReleases = (spotifyId) => {
    setShowReleases((prevShowReleases) => ({
      ...prevShowReleases,
      [spotifyId]: !prevShowReleases[spotifyId]
    }));
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

  return (
    <div className="home-container">
      <h1>Welcome to
        {[' S', 'p', 'o', 't', 'i', 'f', 'y', ' ', 'R', 'e', 'v', 'i', 'e', 'w'].map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </h1>
      <p className='user_hello'><strong>Hello</strong> {user.displayName} !</p>
      <a href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">
        <img src="/spotify.png" alt="Spotify" className="spotify2" />
      </a>
      <h2><u>Favorites Artists</u></h2>
      <div className="search-bar">
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Research an artist"
        />
        <button onClick={handleSearch}>Research</button>
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Results of research</h2>
          <ul className='result'>
            {searchResults.map((artist) => (
              <li key={artist.id}>
                <img src={artist.images[0]?.url} alt={artist.name} />
                {artist.name}
                <button onClick={() => handleAddArtist(artist)}>Add</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedArtist && (
        <div className="selected-artist">
          <p></p>
        </div>
      )}
      {favoriteArtists.length > 0 && (
        <div className="favorite-artists">
          <div className="artists">
            {favoriteArtists.map((artist) => (
              <div className="artist" key={artist.spotifyId}>
                <a href={`https://open.spotify.com/artist/${artist.spotifyId}`} target="_blank" rel="noopener noreferrer">
                  <img src={artist.imageUrl} alt={artist.name} />
                </a>
                <p>{artist.name}</p>
                <button className="click_release" onClick={() => toggleReleases(artist.spotifyId)}><strong>Last Releases</strong></button>
                {showReleases[artist.spotifyId] && (
                  <div className="latest-releases">
                    {artist.latestAlbum && (
                      <div className="latest-album">
                        <h4><u>Latest Album:</u></h4>
                        <img src={artist.latestAlbum.imageUrl} alt={artist.latestAlbum.name} className="small-image" />
                        <p>{artist.latestAlbum.name}</p>
                      </div>
                    )}
                    {artist.latestTrack && (
                      <div className="latest-track">
                        <h4><u>Latest Track:</u></h4>
                        <img src={artist.latestTrack.imageUrl} alt={artist.latestTrack.name} className="small-image" />
                        <p>{artist.latestTrack.name}</p>
                      </div>
                    )}
                  </div>
                )}
                <button className="click_delete" onClick={() => handleRemoveArtist(artist.spotifyId)}><strong>Delete</strong></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
