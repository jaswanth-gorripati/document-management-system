const mongoose = require("../loaders/mongoose");

const foldersSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  owner: { type: String, required: true },
  files: {
    type: [
      {
        content: { type: String, required: true },
        fileName: { type: String, required: true },
        createdOn: { type: Number, requied: true },
      },
    ],
    required: false,
  },
});
const folders = mongoose.model("folders", foldersSchema);

module.exports = folders;
