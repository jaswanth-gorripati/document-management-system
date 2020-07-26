const mongoose = require("mongoose");
const CONFIG = require("./dotenv");
const logger = require("./logger");
mongoose.connect(
  "mongodb://" +
    CONFIG.MONGODB_HOST +
    ":" +
    CONFIG.MONGODB_PORT +
    "/" +
    CONFIG.MONGO_DATABASE +
    "",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
var db = mongoose.connection;
db.on("error", (err) => {
  logger.error("Cannot connect to MongoDb ", err);
});
db.once("open", function () {
  logger.info("MongoDB connected");
});

module.exports = mongoose;
