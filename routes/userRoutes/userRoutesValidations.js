const { validateErrors } = require("../../utils/validationErrors");
exports.regValidations = async (req, res, next) => {
  let errors = [];
  if (req.body.userName == undefined) {
    errors.push("userName");
  }
  if (req.body.password == undefined || req.body.password == "") {
    errors.push("password");
  }
  return await validateErrors(errors);
};
