const mongoose = require("../loaders/mongoose");
const CONFIG = require("../loaders/dotenv");

const usersSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true, index: true },
  password: {
    type: String,
    minlength: CONFIG.PASSWORD_MINLENGTH,
    required: true,
  },
});
const users = mongoose.model("users", usersSchema);

module.exports = users;
