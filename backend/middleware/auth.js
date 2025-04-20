const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = { id: user._id };
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { authenticateJWT };
