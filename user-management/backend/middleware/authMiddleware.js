const jwt = require("jsonwebtoken");
const userSchema = require("../model/userSchema");
const adminSchema = require("../model/adminSchema");
const verifyUserToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DECODED", decoded);
      req.user = await userSchema.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Error occurred in verifyUserToken", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const verifyAdminToken = async (req, res, next) => {
  let token;
  console.log("IN verifytokne")

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await adminSchema.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res
          .status(401)
          .json({ message: "No admin found with this token" });
      }

      next();
    } catch (error) {
      console.error("Error occurred during verifyAdminToken", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No Authorization header or Bearer token missing");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { verifyAdminToken, verifyUserToken };
