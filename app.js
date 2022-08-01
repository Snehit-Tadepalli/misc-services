const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const homeRouter = require("./routes/homeRoute");
const testRouter = require("./routes/testRoute");
const changesetsRouter = require("./routes/changesetsRoute");
const taskCountRouter = require("./routes/taskCountRoute");

const handleError = require("./utils/errorHandler");

app.use("/", homeRouter);
app.use("/test", testRouter);
app.use("/changesets", changesetsRouter);
app.use("/taskCount", taskCountRouter);

app.all("*", (_, res) => {
  res.status(404).json({ status: "failed", mesasge: "Invalid request" });
});

app.use(handleError);

app.listen(port, () => console.log(`Server listening at port: ${port}`));
