exports.validateErrors = async (errors) => {
  if (errors.length > 0) {
    throw new Error(
      JSON.stringify({
        code: 404,
        error: [
          {
            message: "Required fields '" + errors.toString() + "'",
          },
        ],
      })
    );
  }
  return;
};
