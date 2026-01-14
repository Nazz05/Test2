const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());

// Middleware để log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer token"
  
  // Auth routes không cần JWT
  if (req.path.includes('/auth/')) {
    return next();
  }
  
  // Product routes không cần JWT (public access)
  if (req.path.startsWith('/api/products')) {
    return next();
  }
  
  // Các routes khác cần JWT
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('Token verified for user:', decoded.username);
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  next();
};

app.use(verifyToken);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway running', timestamp: new Date() });
});

// Auth routes - Register
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Forwarding register request to backend');
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Registration failed',
      error: error.response?.data || error.message
    });
  }
});

// Auth routes - Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Forwarding login request to backend');
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, req.body);
    
    // Backend returns: { id, token, username, email, fullName, phone, role, status }
    const { id, token, username, email, fullName, phone, role, status } = response.data;
    
    // Forward the response directly with id included
    res.json({
      id,
      token,
      username,
      email,
      fullName,
      phone,
      role,
      status,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(error.response?.status || 401).json({
      message: error.response?.data?.message || 'Invalid credentials',
      error: error.response?.data || error.message
    });
  }
});

// Auth routes - Validate Token
app.post('/api/auth/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      valid: true,
      user: decoded,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token validation error:', error.message);
    res.status(401).json({
      valid: false,
      message: error.message
    });
  }
});

// Generic route forwarder with intelligent routing
const forwardRequest = async (req, res, targetUrl, stripApiPrefix = true) => {
  try {
    const path = stripApiPrefix ? req.path.replace('/api', '') : req.path;
    const config = {
      headers: {
        Authorization: req.headers.authorization
      }
    };
    
    console.log(`[FORWARD] ${req.method} ${req.path} -> ${targetUrl}${path}`);
    
    let response;
    switch (req.method.toUpperCase()) {
      case 'GET':
        response = await axios.get(`${targetUrl}${path}`, config);
        break;
      case 'POST':
        response = await axios.post(`${targetUrl}${path}`, req.body, config);
        break;
      case 'PUT':
        response = await axios.put(`${targetUrl}${path}`, req.body, config);
        break;
      case 'DELETE':
        response = await axios.delete(`${targetUrl}${path}`, config);
        break;
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Request failed',
      error: error.response?.data || error.message
    });
  }
};

// Product Service Routes - Keep /api prefix since product service expects it
// Match all GET /api/products* requests (with any sub-path)
app.get('/api/products*', async (req, res) => {
  const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
  return forwardRequest(req, res, PRODUCT_SERVICE_URL, false); // Don't strip /api
});

app.post('/api/products*', async (req, res) => {
  const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
  return forwardRequest(req, res, PRODUCT_SERVICE_URL, false); // Don't strip /api
});

app.put('/api/products*', async (req, res) => {
  const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
  return forwardRequest(req, res, PRODUCT_SERVICE_URL, false); // Don't strip /api
});

app.delete('/api/products*', async (req, res) => {
  const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';
  return forwardRequest(req, res, PRODUCT_SERVICE_URL, false); // Don't strip /api
});

// Generic routes for other /api/* requests - catch-all (strip /api for backend)
app.all('/api/*', async (req, res) => {
  return forwardRequest(req, res, BACKEND_URL, true); // Strip /api for backend
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║        API Gateway Started               ║
║   Port: ${PORT}                              ║
║   Backend: ${BACKEND_URL}              ║
║   Product Service: ${process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081'}     ║
╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
