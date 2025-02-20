const JWT = require("jsonwebtoken");
const crypto = require('crypto');
const { handleResponse } = require('../utils/helper');



exports.signAccessToken = (userId, user_role) => {
  return exports.generateToken(userId, user_role, process.env.ACCESS_TOKEN_SECRET); // Use exports.generateToken
};

exports.generateToken = (userId, user_role, secret, expiresIn = '3h') => {
  return new Promise((resolve, reject) => {
    const payload = {
      aud: "parkhya.in",
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
    const options = { expiresIn: '1h' };

    JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, options, (err, token) => {
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

exports.verifyUser = async (req, res, next) => {
  // Try to extract token from Authorization header (Bearer token), custom token header, query parameter, or request body
  let encryptedToken = req.headers.authorization
                        ? req.headers.authorization.split(' ')[1] // Extract token from Bearer format
                        : req.headers['x-auth-token'] || // Custom header for token
                          req.query.q || // Query parameter
                          req.body.token; // Request body

  // If no token is provided, return an error
  if (!encryptedToken) {
    return handleResponse(res, 401, "No token provided");
  }

  try {
    // Decrypt the token (if it's encrypted)
    const decryptedToken = exports.decryptToken(encryptedToken);

    // Verify the decrypted token using JWT
    const decodedToken = JWT.verify(decryptedToken, process.env.ACCESS_TOKEN_SECRET);

    // If token is invalid or expired
    if (!decodedToken) {
      return handleResponse(res, 401, "Invalid or expired token");
    }

    // Attach the decoded user information to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle errors, such as expired or invalid token
    return handleResponse(res, 401, "Invalid or expired token");
  }
};


// exports.verifyUser = async (req, res, next) => {
//   // Try to extract token from Authorization header (Bearer token), query parameter, or request body
//   let encryptedToken = req.headers.authorization 
//                         ? req.headers.authorization.split(' ')[1] // Extract token from Bearer format
//                         : req.query.q || req.body.token ||req.headers.authorization;

//   if (!encryptedToken) {
//     return handleResponse(res, 401, "No token provided");
//   }

//   try {
//     // Decrypt the token (if it's encrypted)
//     const decryptedToken = exports.decryptToken(encryptedToken);

//     // Verify the decrypted token using JWT
//     const decodedToken = JWT.verify(decryptedToken, process.env.ACCESS_TOKEN_SECRET);

//     if (!decodedToken) {
//       return handleResponse(res, 401, "Invalid or expired token");
//     }

//     // Attach the decoded user information to the request object
//     req.user = decodedToken;

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (err) {
//     // Handle errors, such as expired or invalid token
//     return handleResponse(res, 401, "Invalid or expired token");
//   }
// };

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
