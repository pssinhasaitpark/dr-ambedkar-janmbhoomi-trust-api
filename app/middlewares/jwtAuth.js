const JWT = require("jsonwebtoken");
const crypto = require('crypto');
const { handleResponse } = require('../utils/helper');



exports.signAccessToken = (userId, user_role) => {
  return exports.generateToken(userId, user_role, process.env.ACCESS_TOKEN_SECRET);
};

exports.generateToken = (userId, user_role, secret, expiresIn = process.env.EXPIREIN) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user_id: userId,
      user_role: user_role,
    };

    const options = {
      subject: `${userId}`,
      expiresIn,
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

exports.signResetToken = (email) => {
  return new Promise((resolve, reject) => {
    const payload = { email };
    const options = { expiresIn: '5m' };

    JWT.sign(payload, process.env.RESET_TOKEN_SECRET, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

exports.encryptToken = (token) => {
  const key = crypto.createHash('sha256').update(process.env.ACCESS_TOKEN_SECRET).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(process.env.ACCESS_TOKEN_SECRET).slice(0, 16));
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

exports.decryptToken = (encryptedToken) => {
  const key = crypto.createHash('sha256').update(process.env.ACCESS_TOKEN_SECRET).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(process.env.ACCESS_TOKEN_SECRET).slice(0, 16));
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.verifyToken = async (req, res, next) => {
  let encryptedToken = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : req.headers['x-auth-token'] ||
    req.query.q ||
    req.body.token;


  if (!encryptedToken) {
    return handleResponse(res, 401, "No token provided");
  }

  try {
    const decryptedToken = exports.decryptToken(encryptedToken);

    const decodedToken = JWT.verify(decryptedToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      return handleResponse(res, 401, "Invalid or expired token");
    }

    req.user = decodedToken;

    next();
  } catch (err) {
    return handleResponse(res, 401, "Invalid or expired token");
  }
};


exports.verifyResetToken = async (req, res, next) => {
  let encryptedToken = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : req.headers['x-auth-token'] ||
    req.query.q ||
    req.body.token;


  if (!encryptedToken) {
    return handleResponse(res, 401, "No token provided");
  }

  try {
    const decryptedToken = exports.decryptToken(encryptedToken);

    const decodedToken = JWT.verify(decryptedToken, process.env.RESET_TOKEN_SECRET);

    if (!decodedToken) {
      return handleResponse(res, 401, "Invalid or expired token");
    }

    req.user = decodedToken;

    next();
  } catch (err) {
    return handleResponse(res, 401, "Invalid or expired token");
  }
};


exports.verifyToken = async (req, res, next) => {

  let encryptedToken = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : req.headers['x-auth-token'] ||
    req.query.q ||
    req.body.token;

  if (!encryptedToken) {
    return handleResponse(res, 401, "No token provided");
  }

  try {
    const decryptedToken = exports.decryptToken(encryptedToken);

    const decodedToken = JWT.verify(decryptedToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      return handleResponse(res, 401, "Invalid or expired token");
    }

    req.user = decodedToken;

    next();
  } catch (err) {
    return handleResponse(res, 401, "Invalid or expired token");
  }
};


exports.verifyAdmin = (req, res, next) => {
  const { user_role } = req.user;
  if (user_role !== 'admin') {
    return handleResponse(res, 403, "Access forbidden: Admins only");
  }
  next();
};



exports.verifyRole = (req, res) => {
  const { user_role, encryptedToken } = req.user;

  let dashboardUrl = '';
  let responseMessage = '';

  if (user_role === 'super_admin') {
    responseMessage = 'Super Admin Login successfully!';
  } else if (user_role === 'admin') {
    responseMessage = 'Admin Login successfully!';
  } else if (user_role === 'user') {
    responseMessage = 'User Login successfully!';
  }

  return handleResponse(res, 200, responseMessage, { encryptedToken, user_role });
};


