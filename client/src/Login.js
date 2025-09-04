import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email: values.email,
        password: values.password
      });
      
      // Store the token in cookies with secure settings
      Cookies.set('token', response.data.token, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      message.success('Login successful!');
      navigate('/listings'); // Redirect to listings page after successful login
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Login failed');
      } else {
        message.error('Network error. Please try again.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      form.submit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          width: '33.333333%',
          height: '33.333333vh',
          minWidth: '320px',
          minHeight: '400px'
        }}
      >
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 h-1/3 flex flex-col justify-center">
          <h2 className="text-center text-xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="text-center text-blue-100 mt-1 text-sm">
            Sign in to your account
          </p>
        </div>
        
        <div className="px-6 py-4 h-2/3 flex flex-col justify-center items-center">
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="middle"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Enter your email" 
                size="middle"
                onKeyPress={handleKeyPress}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                size="middle"
                onKeyPress={handleKeyPress}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                size="middle"
                className="w-full rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
