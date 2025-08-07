const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, return unauthorized
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token has expired (jwt.verify should catch this, but extra safety)
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ 
        message: 'Token has expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Access denied. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Access denied. Please verify your email address.',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access denied. Token has expired.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'NotBeforeError') {
      return res.status(401).json({ 
        message: 'Access denied. Token not active yet.',
        code: 'TOKEN_NOT_ACTIVE'
      });
    }

    // Database or other errors
    return res.status(500).json({ 
      message: 'Internal server error during authentication.',
      code: 'AUTH_ERROR'
    });
  }
};

const adminOnly = (req, res, next) => {
  // Check if user exists
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Access denied. Authentication required.',
      code: 'NO_USER'
    });
  }

  // Check if user has admin privileges
  const isAdmin = req.user.role === 'admin';
  
  if (!isAdmin) {
    return res.status(403).json({ 
      message: 'Access denied. Administrator privileges required.',
      code: 'INSUFFICIENT_PRIVILEGES'
    });
  }

  next();
};

// User or Admin
const userOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Access denied. Authentication required.',
      code: 'NO_USER'
    });
  }

  const isAdmin = req.user.role === 'admin' || req.user.isAdmin === true;
  const isUser = req.user._id.toString() === req.params.id || req.user._id.toString() === req.params.userId;

  if (!isAdmin && !isUser) {
    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.',
      code: 'ACCESS_DENIED'
    });
  }

  next();
};

module.exports = { 
  protect, 
  adminOnly, 
  userOrAdmin 
};