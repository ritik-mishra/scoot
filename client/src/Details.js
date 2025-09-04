import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, message, Button, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined, DashboardOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBikeDetails();
  }, [id]);

  const fetchBikeDetails = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/bikes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBike(response.data);
      
      // Fetch seller details
      if (response.data.sellerId) {
        await fetchSellerDetails(response.data.sellerId, token);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Please login again');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        message.error('Bike not found');
        navigate('/listings');
      } else {
        message.error('Failed to fetch bike details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerDetails = async (sellerId, token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSeller(response.data);
    } catch (error) {
      console.error('Failed to fetch seller details:', error);
      // Don't show error to user, just set seller as unknown
      setSeller({ name: 'Unknown Seller' });
    }
  };

  const handleBackToListings = () => {
    navigate('/listings');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Bike not found</p>
          <Button onClick={handleBackToListings} className="mt-4">
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToListings}
            className="flex items-center text-gray-600 hover:text-gray-800"
            size="large"
          >
            Back to Listings
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative">
            <img
              src={bike.imageUrl}
              alt={`${bike.brand} ${bike.model}`}
              className="w-full object-cover"
              style={{ height: '30vh' }}
              onError={(e) => {
                console.log("Error in Details component: ",e);
              }}
            />
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8">
            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {bike.brand} {bike.model}
              </h1>
              <div className="text-3xl font-bold text-blue-600">
                ₹{bike.price.toLocaleString()}
              </div>
            </div>

            <Divider />

            {/* Bike Details */}
            <Row gutter={[24, 16]} className="mb-6">
              <Col xs={24} sm={12}>
                <div className="flex items-center space-x-3">
                  <CalendarOutlined className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-gray-500 text-sm">Year</p>
                    <p className="font-semibold text-gray-800">{bike.year}</p>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div className="flex items-center space-x-3">
                  <DashboardOutlined className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-gray-500 text-sm">Kilometers Driven</p>
                    <p className="font-semibold text-gray-800">
                      {bike.kilometers_driven.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div className="flex items-center space-x-3">
                  <EnvironmentOutlined className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-semibold text-gray-800">{bike.location}</p>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div className="flex items-center space-x-3">
                  <UserOutlined className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-gray-500 text-sm">Seller</p>
                    <p className="font-semibold text-gray-800">
                      {seller ? seller.name : 'Loading...'}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Bike ID</p>
                  <p className="font-medium text-gray-800">{bike.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Listed On</p>
                  <p className="font-medium text-gray-800">
                    {new Date(bike.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
