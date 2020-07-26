const mongoose = require("../loaders/mongoose");

const filesSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  fileName: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  createdOn: { type: Number, requied: true },
});
const files = mongoose.model("files", filesSchema);

module.exports = files;
