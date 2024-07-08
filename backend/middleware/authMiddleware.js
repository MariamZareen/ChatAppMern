const jwt = require('jsonwebtoken');
const User = require('../modals/userModels');
const expressAsyncHandler = require('express-async-handler');

const protect = expressAsyncHandler(async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      throw new Error('No token found in Authorization header');
    }
    
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(404).send({ message: 'User not found' });
    }

    next();
  } catch (e) {
    console.error('Error during authentication:', e.message);
    return res.status(401).send({ message: 'Not authorized, token failed' });
  }
});


module.exports = { protect };
