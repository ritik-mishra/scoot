import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Listings from './Listings';
import MyListings from './MyListings';
import Details from './Details';
import Edit from './Edit';
import ProtectedRoute from './ProtectedRoute';
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/listings" replace />} />
          <Route path="/listings" element={
            <ProtectedRoute>
              <Listings />
            </ProtectedRoute>
          } />
          <Route path="/mylistings" element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          } />
          <Route path="/details/:id" element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
