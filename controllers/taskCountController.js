exports.taskCount = async (req, res, next) => {
  try {
    const { challengeId, time } = req.query;
    const [startTime, endTime] = time.split(",");
    console.log(challengeId, startTime, endTime);
    res.status(200).json({
      status: "success",
      message: "Route is still under development process.",
      output: [],
    });
  } catch (e) {
    next(e);
  }
};
