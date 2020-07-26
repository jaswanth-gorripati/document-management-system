const routes = (module.exports = require("express")());
const { sendResponse } = require("../../utils/sendResponse");
const userController = require("../../controllers/userController");
const userValidations = require("./userRoutesValidations");

routes.post(
  "/register",
  async (req, res, next) => {
    try {
      await userValidations.regValidations(req, res, next);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await userController.register(
        req.body.userName,
        req.body.password
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);

routes.post(
  "/login",
  async (req, res, next) => {
    try {
      await userValidations.regValidations(req, res, next);
      next();
    } catch (err) {
      await sendResponse(err, res);
    }
  },
  async function (req, res) {
    try {
      let data = await userController.login(
        req.body.userName,
        req.body.password
      );
      res.status(200).send(data);
    } catch (err) {
      await sendResponse(err, res);
    }
  }
);
