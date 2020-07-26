var jwt = require("jsonwebtoken");
const app = require("../loaders/jwt");
/**
 * @param  {} username
 * @return {} token
 */
async function generateToken(username) {
  try {
    var token = await jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + parseInt(360000),
        username: username,
      },
      app.get("secret")
    );
    return token;
  } catch (err) {
    return err;
  }
}

module.exports = generateToken;
