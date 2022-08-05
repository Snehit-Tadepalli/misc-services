const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");

const homeRouter = require("./routes/homeRoute");
const testRouter = require("./routes/testRoute");
const changesetsRouter = require("./routes/changesetsRoute");
const taskCountRouter = require("./routes/taskCountRoute");

const handleError = require("./utils/errorHandler");

const logger = morgan(
  `:remote-addr, :remote-user, :status, :date[iso], :method, :url, HTTP/:http-version, :res[content-length], :referrer, :user-agent`
);

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many request from this IP, please try again after few minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(logger);
app.use("*", limiter);

app.use("/", homeRouter);
app.use("/test", testRouter);
app.use("/changesets", changesetsRouter);
app.use("/taskCount", taskCountRouter);

app.all("*", (_, res) => {
  res.status(404).json({ status: "failed", mesasge: "Invalid request" });
});

app.use(handleError);

app.listen(port, () => console.log(`Server listening at port: ${port}`));
