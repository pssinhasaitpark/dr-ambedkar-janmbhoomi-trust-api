const JWT = require("jsonwebtoken");
const crypto = require('crypto');



const generateToken = (userId,user_role,  secret, expiresIn = '3h') => {
  return new Promise((resolve, reject) => {
    const payload = {
      aud: "parkhya.in",
      user_id: userId,
      user_role:user_role
   
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


const signAccessToken = (userId,user_role) => {
  return generateToken(userId,user_role, process.env.ACCESS_TOKEN_SECRET);
};

const signResetToken = (email) => {
  return new Promise((resolve, reject) => {
    const payload = { email };
    const options = { expiresIn: '1h' };

    JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const encryptToken=(token) =>
  {
 
  const key = crypto.createHash('sha256').update(process.env.ACCESS_TOKEN_SECRET).digest();

  const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(process.env.ACCESS_TOKEN_SECRET).slice(0, 16));  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const decryptToken=(encryptedToken)=>{
  const key = crypto.createHash('sha256').update(process.env.ACCESS_TOKEN_SECRET).digest();

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(process.env.ACCESS_TOKEN_SECRET).slice(0, 16));  
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const verifyUser = async (req, res, next) => {
  
  let encryptedToken = req.headers.authorization;
  if (!encryptedToken) {
    encryptedToken = req.query.token || req.body.token;
  }

  if (!encryptedToken) {
    return handleResponse(res, 401, "No token provided");
  }

  try {
    const decryptedToken = decryptToken(encryptedToken);

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

module.exports = {
  signAccessToken,
  signResetToken,
  verifyUser,
  decryptToken,
  encryptToken
};
