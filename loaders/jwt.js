const express = require("express");
const expressJWT = require("express-jwt");
const bearerToken = require("express-bearer-token");
var jwt = require("jsonwebtoken");
const CONFIG = require("./dotenv");
const app = express();
const logger = require("./logger");
const { errorHandler } = require("../utils/errorHandler");

app.set("secret", CONFIG.JWT_SECRET);
const unprotected = ["/login", "/register"];
app.use(
  expressJWT({
    secret: CONFIG.JWT_SECRET,
  }).unless({
    path: unprotected,
  })
);

app.use(bearerToken());
app.use(async function (req, res, next) {
  logger.info(" New request for  " + req.originalUrl + " from " + req.ip);
  if (req.originalUrl.indexOf("/login") >= 0) {
    return next();
  } else if (req.originalUrl.indexOf("/register") >= 0) {
    return next();
  }
  var token = req.token;
  jwt.verify(token, app.get("secret"), async function (err, decoded) {
    if (err) {
      res.send(
        await errorHandler.fcnGenError(
          401,
          "Failed to authenticate token. Make sure to include the " +
            "token returned from login in the authorization header " +
            " as a Bearer token"
        )
      );
      return;
    } else {
      res.token = token;
      req.exp = decoded.exp;
      req.userName = decoded.username;
      logger.info(
        "Decoded from JWT token: username - " +
          decoded.username +
          ", expiry - " +
          decoded.exp
      );
      return next();
    }
  });
});

module.exports = app;
