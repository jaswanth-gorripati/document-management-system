const routes = (module.exports = require("express")());
const { sendResponse } = require("../../utils/sendResponse");
const dmsController = require("../../controllers/dmsController");
const dmsValidations = require("./dmsRouteValidations");

routes.post(
  "/createfolder",
  async (req, res, next) => {
    try {
      await dmsValidations.createFolderValidation(req);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await dmsController.createFolder(
        req.body.folderName,
        req.userName
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);
routes.post(
  "/addFile",
  async (req, res, next) => {
    try {
      await dmsValidations.addFileValidation(req);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await dmsController.addFile(
        req.files,
        req.userName,
        req.body.folderName
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);
routes.post(
  "/moveFile",
  async (req, res, next) => {
    try {
      await dmsValidations.moveFileValidation(req);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await dmsController.moveFile(
        req.userName,
        req.body.srcFile,
        req.body.srcFolder,
        req.body.destFolder,
        req.body.opCode
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);

routes.get(
  "/filesInFolder",
  async (req, res, next) => {
    try {
      await dmsValidations.filesInFolderValidation(req);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await dmsController.filesInFolder(
        req.query.folderName,
        req.userName
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);

routes.get("/list", async function (req, res) {
  try {
    let data = await dmsController.list(req.userName);
    res.status(200).send(data);
  } catch (err) {
    await sendResponse(err, res);
  }
});
routes.get(
  "/file",
  async (req, res, next) => {
    try {
      await dmsValidations.fileValidation(req);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await dmsController.file(
        req.query.fileName,
        req.userName,
        req.query.folderName
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);
