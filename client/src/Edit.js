import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, message, Card, InputNumber } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      
      // Pre-fill the form with bike data
      form.setFieldsValue({
        brand: response.data.brand,
        model: response.data.model,
        year: response.data.year,
        price: response.data.price,
        kilometers_driven: response.data.kilometers_driven,
        location: response.data.location,
        imageUrl: response.data.imageUrl
      });
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Please login again');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        message.error('Bike not found');
        navigate('/mylistings');
      } else {
        message.error('Failed to fetch bike details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const token = Cookies.get('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/bikes/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      message.success('Bike updated successfully!');
      navigate('/mylistings');
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Please login again');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        message.error('You can only edit your own bikes');
        navigate('/mylistings');
      } else {
        message.error('Failed to update bike');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToMyListings = () => {
    navigate('/mylistings');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      form.submit();
    }
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
          <Button onClick={handleBackToMyListings} className="mt-4">
            Back to My Listings
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
            onClick={handleBackToMyListings}
            className="flex items-center text-gray-600 hover:text-gray-800"
            size="large"
          >
            Back to My Listings
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-lg">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Edit Bike Listing
            </h1>
            <p className="text-gray-600">
              Update the details for your {bike.brand} {bike.model}
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="brand"
                label="Brand"
                rules={[
                  { required: true, message: 'Please enter the brand!' },
                  { min: 2, message: 'Brand must be at least 2 characters!' }
                ]}
              >
                <Input 
                  placeholder="Enter brand name"
                  onKeyPress={handleKeyPress}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="model"
                label="Model"
                rules={[
                  { required: true, message: 'Please enter the model!' },
                  { min: 2, message: 'Model must be at least 2 characters!' }
                ]}
              >
                <Input 
                  placeholder="Enter model name"
                  onKeyPress={handleKeyPress}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="year"
                label="Year"
                rules={[
                  { required: true, message: 'Please enter the year!' },
                  { type: 'number', min: 1900, max: new Date().getFullYear() + 1, message: 'Please enter a valid year!' }
                ]}
              >
                <InputNumber 
                  placeholder="Enter year"
                  className="w-full rounded-lg"
                  onKeyPress={handleKeyPress}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price (₹)"
                rules={[
                  { required: true, message: 'Please enter the price!' },
                  { type: 'number', min: 1, message: 'Price must be greater than 0!' }
                ]}
              >
                <InputNumber 
                  placeholder="Enter price"
                  className="w-full rounded-lg"
                  onKeyPress={handleKeyPress}
                  min={1}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="kilometers_driven"
                label="Kilometers Driven"
                rules={[
                  { required: true, message: 'Please enter kilometers driven!' },
                  { type: 'number', min: 0, message: 'Kilometers must be 0 or greater!' }
                ]}
              >
                <InputNumber 
                  placeholder="Enter kilometers"
                  className="w-full rounded-lg"
                  onKeyPress={handleKeyPress}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                name="location"
                label="Location"
                rules={[
                  { required: true, message: 'Please enter the location!' },
                  { min: 2, message: 'Location must be at least 2 characters!' }
                ]}
              >
                <Input 
                  placeholder="Enter location"
                  onKeyPress={handleKeyPress}
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="imageUrl"
              label="Image URL"
              rules={[
                { required: true, message: 'Please enter the image URL!' },
                { type: 'url', message: 'Please enter a valid URL!' }
              ]}
            >
              <Input 
                placeholder="Enter image URL"
                onKeyPress={handleKeyPress}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={submitting}
                className="w-full rounded-lg h-12 text-base font-medium"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {submitting ? 'Updating...' : 'Update Bike'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Edit;
