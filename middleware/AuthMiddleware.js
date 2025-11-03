import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.json({
        result: {},
        message: "No token provided",
        status: "0",
      });
    }

    // token format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        result: {},
        message: "Invalid token format",
        status: "0",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
      if (err) {
        return res.json({
          result: {},
          message: "Token is not valid",
          status: "0",
        });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.error(err);
    return res.json({
      result: {},
      message: "server error",
      status: "0",
    });
  }
};
