const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function userAuthMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded; // attach decoded payload
    next();
  });
}

module.exports = { userAuthMiddleware , JWT_SECRET};
