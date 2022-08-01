const customMiddleware = (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
};

module.exports = customMiddleware;
