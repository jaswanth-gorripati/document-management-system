const mongoose = require("../loaders/mongoose");

const foldersSchema = new mongoose.Schema({
  folderName: { type: String, required: true, index: true },
  owner: { type: String, required: true, index: true },
  files: {
    type: [
      {
        content: { type: String, required: true },
        fileName: { type: String, required: true, index: true },
        createdOn: { type: Number, requied: true },
      },
    ],
    required: false,
  },
});
const folders = mongoose.model("folders", foldersSchema);

module.exports = folders;
