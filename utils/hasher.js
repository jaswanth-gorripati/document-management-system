const bcrypt = require("bcrypt");
const CONFIG = require("../loaders/dotenv");
/**
 * @param  {} password
 */
async function passwordHasher(password) {
  try {
    return await bcrypt.hash(password, parseInt(CONFIG.BCRYPT_SALT_ROUNDS));
  } catch (err) {
    return err;
  }
}
/**
 * @param  {} password
 * @param  {} hash
 */
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    return err;
  }
}

exports.passwordHasher = passwordHasher;
exports.comparePassword = comparePassword;
