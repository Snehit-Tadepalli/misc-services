const handleError = async (err, req, res, next) => {
  res
    .status(400)
    .json({ status: "failed", message: `${err.message}`, output: [] });
};

module.exports = handleError;
