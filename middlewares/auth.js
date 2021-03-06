const jwt = require("jsonwebtoken");

const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  //Set token from Bearer token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("Bearer");
  } else if (req.cookies.token) {
    //Set token from cookie
    token = req.cookies.token;
    // console.log("Cookie");
  }

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //    Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("protect 28", decoded);

    //    Get logged in user and add to request
    req.user = await User.findById(decoded.id);
    // console.log("protect, 32", req.user);
    next();
  } catch (e) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is unauthorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
