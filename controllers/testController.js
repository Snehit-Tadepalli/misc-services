exports.test = async (_, res, next) => {
  try {
    res
      .status(200)
      .json({ status: "success", message: "API is working fine", output: [] });
  } catch (e) {
    next(e);
  }
};
