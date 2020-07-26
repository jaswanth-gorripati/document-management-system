const helmet = require("helmet");
const app = require("./loaders/express");
const jwtLoader = require("./loaders/jwt");
const CONFIG = require("./loaders/dotenv");
const logger = require("./loaders/logger");
const handleAsyncExceptions = require("./loaders/handleError");
const routes = require("./routes");

app.use(jwtLoader);
app.use(helmet());
app.set("trust proxy", true);

/**Express server starts here */
async function run() {
  try {
    // Mounting routes
    app.use(routes);

    // Server starts here
    app.listen(CONFIG.EXPRESS_PORT, CONFIG.EXPRESS_HOST, function (err) {
      if (err) {
        logger.error("Failed to start the server " + err);
      }
      logger.info(
        "DMS apis are running on http://" +
          CONFIG.EXPRESS_HOST +
          ":" +
          CONFIG.EXPRESS_PORT
      );
    });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = run;

if (require.main === module) {
  handleAsyncExceptions();
  run();
}
