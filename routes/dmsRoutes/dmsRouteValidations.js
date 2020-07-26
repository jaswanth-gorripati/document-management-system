const { validateErrors } = require("../../utils/validationErrors");

exports.createFolderValidation = async (req) => {
  let errors = [];
  if (req.body.folderName == undefined) {
    await errors.push("folderName");
  }
  return await validateErrors(errors);
};

exports.addFileValidation = async (req) => {
  let errors = [];
  if (req.files && req.files.length > 1) {
    await errors.push(" 1 file");
  }
  if (req.files.file.name == undefined) {
    await errors.push("file");
  }
  req.files = req.files.file;
  return await validateErrors(errors);
};
exports.filesInFolderValidation = async (req) => {
  let errors = [];
  if (req.query.folderName == undefined) {
    await errors.push("folderName");
  }
  return await validateErrors(errors);
};
exports.fileValidation = async (req) => {
  let errors = [];
  if (req.query.fileName == undefined) {
    await errors.push("fileName");
  }
  return await validateErrors(errors);
};

exports.moveFileValidation = async (req) => {
  let errors = [];
  if (req.body.srcFile == undefined) {
    await errors.push("srcFile");
  }
  if (req.body.srcFolder == undefined) {
    if (req.body.destFolder == undefined) {
      await errors.push("destFolder/srcFolder");
    } else {
      req.body.opCode = "f-F";
    }
  } else {
    if (req.body.destFolder == undefined) {
      req.body.opCode = "F-f";
    } else {
      req.body.opCode = "F-2-F";
    }
  }
  return await validateErrors(errors);
};
