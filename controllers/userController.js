const generateToken = require("../utils/generateToken");
const hasher = require("../utils/hasher");
const usersModel = require("../models/usersModel");

exports.login = async (userName, password) => {
  let result = await usersModel.findOne({
    userName: userName,
  });
  if (result == null) {
    throw new Error(
      JSON.stringify({
        code: 401,
        error: [
          {
            message: "User not Found with userName '" + userName + "'",
            element: "userName",
          },
        ],
      })
    );
  }
  if (await hasher.comparePassword(password, result.password)) {
    let token = await generateToken(result.userName);
    return {
      token: token,
      userName: userName,
    };
  } else {
    throw new Error(
      JSON.stringify({
        code: 404,
        error: [
          {
            message: "Password mismatch",
            element: "password",
          },
        ],
      })
    );
  }
};

exports.register = async (userName, password) => {
  try {
    let result = await usersModel.findOne({
      userName: userName,
    });
    if (result != null) {
      throw new Error(
        JSON.stringify({
          code: 404,
          error: [
            {
              message: "Username already registered",
              element: "userName",
            },
          ],
        })
      );
    }
    let bycryptedPass = await hasher.passwordHasher(password);
    let user = new usersModel({ userName: userName, password: bycryptedPass });
    await user.save();
    return "User Registered";
  } catch (err) {
    throw err;
  }
};
