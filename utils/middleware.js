const logger = require('./logger')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Invalid ID format' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'Duplicate key error: this value must be unique' });
  } else if (error.name === 'SyntaxError') {
    return response.status(400).json({ error: 'Invalid JSON syntax in request body' });
  } else if (error.message.includes('Username must be')) {
    return response.status(400).json({ error: error.message });
  } else if (error.message.includes('Password must be')) {
    return response.status(400).json({ error: error.message });
  } else if (error.message.includes('unique')) {
    return response.status(400).json({ error: error.message });
  }

  return response.status(500).json({ error: 'Internal server error' });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  try {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(404).json({ error: 'user not found' });
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}