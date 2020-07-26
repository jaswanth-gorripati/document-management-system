const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const errorhandler = require("errorhandler");
const CONFIG = require("./dotenv");
const logger = require("./logger");

const app = express();
app.use(fileUpload());
app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.set("baseUrl", CONFIG.BASEURL);

app.use(bodyParser.json({ limit: "75MB" }));
app.use(
  bodyParser.urlencoded({
    limit: "75MB",
    extended: true,
  })
);
app.use(errorhandler());
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  logger.error(
    `${err.status || 500} - ${JSON.stringify(err.message)} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip} - ${req.headers["x-forwarded-for"]}`
  );

  res.status(err.status || 500);
  res.render(err);
  next(err);
});

module.exports = app;
