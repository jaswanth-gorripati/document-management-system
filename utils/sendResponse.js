const logger = require("../loaders/logger");
exports.sendResponse = async (err, res) => {
  let error = await errorHandler(err);
  logger.error(
    `${error.code || 500} - ${JSON.stringify(error).replace(/"/g, "")}`
  );
  if (error.code == undefined) {
    res.status(500).send("internal server error");
  } else {
    let tmpCode = error.code;
    delete error.code;
    res.status(tmpCode).send(error);
  }
};
async function errorHandler(err) {
  try {
    let errJson = await JSON.parse(
      await err.toString().split("\n")[0].split("Error:")[1]
    );
    return errJson;
  } catch (error) {
    return await { error: err.toString().split("\n")[0] };
  }
}
