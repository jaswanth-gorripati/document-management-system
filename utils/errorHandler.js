const CODES = {
  "401": "Unauthorized",
  "403": "Forbiden",
  "404": "Not Found",
  "500": "Internal server Error"
};
async function fcnGenError(code, message, element) {
  return JSON.stringify({
    code: code,
    type: CODES["" + code + ""],
    message: message,
    element: element || ""
  });
}

exports.errorHandler = {
  fcnGenError: fcnGenError
};
