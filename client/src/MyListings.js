import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const MyListings = () => {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBikes();
  }, []);

  useEffect(() => {
    filterBikes();
  }, [bikes, searchQuery]);

  const fetchMyBikes = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/bikes/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBikes(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Please login again');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      } else {
        message.error('Failed to fetch your bikes');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterBikes = () => {
    if (!searchQuery.trim()) {
      setFilteredBikes(bikes);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = bikes.filter(bike => 
      bike.brand.toLowerCase().includes(query) ||
      bike.model.toLowerCase().includes(query) ||
      `${bike.brand} ${bike.model}`.toLowerCase().includes(query)
    );
    setFilteredBikes(filtered);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      filterBikes();
    }
  };

  const handleCardClick = (bikeId) => {
    navigate(`/edit/${bikeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Listings</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your bike listings</p>
            </div>
            
            <div className="w-full sm:w-80">
              <Search
                placeholder="Search by brand or model..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                onKeyPress={handleKeyPress}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {searchQuery && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                Showing {filteredBikes.length} result{filteredBikes.length !== 1 ? 's' : ''} for "{searchQuery}"
                {filteredBikes.length !== bikes.length && (
                  <span className="text-blue-600 ml-2">
                    (of {bikes.length} total bikes)
                  </span>
                )}
              </p>
            </div>
          )}

          {filteredBikes.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <div>
                  <p className="text-gray-500 text-lg mb-2">No bikes found for "{searchQuery}"</p>
                  <p className="text-gray-400 text-sm">Try searching with different keywords</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 text-lg mb-4">You haven't listed any bikes yet.</p>
                  <p className="text-gray-400 text-sm">Start by adding your first bike listing!</p>
                </div>
              )}
            </div>
          ) : (
            <Row gutter={[16, 16]} className="sm:gutter-24">
              {filteredBikes.map((bike) => (
                <Col key={bike._id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    className="h-full transition-all duration-200 hover:shadow-lg cursor-pointer"
                    onClick={() => handleCardClick(bike.id)}
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {bike.brand} {bike.model}
                      </h3>
                      <p className="text-gray-600 text-sm">Year: {bike.year}</p>
                      <p className="text-gray-600 text-sm">
                        Kilometers: {bike.kilometers_driven.toLocaleString()} km
                      </p>
                      <p className="text-gray-600 text-sm">Location: {bike.location}</p>
                      <div className="pt-2">
                        <span className="text-xl font-bold text-blue-600">
                          ₹{bike.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Click to edit
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListings;
