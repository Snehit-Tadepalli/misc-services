exports.home = async (_, res, next) => {
  try {
    res
      .status(200)
      .json({ status: "success", message: "Welcome to homepage", output: [] });
  } catch (e) {
    next(e);
  }
};
