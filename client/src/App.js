import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import History from './components/History';
import Top10 from './components/Top10';
import Recommendations from './components/Recommendations';
import Nav from './components/Nav';
import SideNav from './components/SideNav';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <SideNav />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/top10" element={<Top10 />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
