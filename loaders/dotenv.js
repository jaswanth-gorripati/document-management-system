let dotenv = require("dotenv");

const CONFIG = dotenv.config({ path: "" + (process.cwd(), ".env") + "" });
if (CONFIG.error) {
  throw CONFIG.error;
}
module.exports = CONFIG.parsed;
