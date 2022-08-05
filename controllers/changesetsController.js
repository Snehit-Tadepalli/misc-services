const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { DAY, HOUR } = require("../utils/time");
const userData = require("../utils/userData");

const getISO = (UNIXTimeStamp) => {
  return new Date(UNIXTimeStamp).toISOString();
};

const checkTimeDifference = (startTime, endTime) => {
  const start = Date.parse(startTime);
  let end = endTime === null ? Date.now() : Date.parse(endTime);

  if (end < start) throw new Error("End date is higher than start date");

  if (start === end) end = start + HOUR * 24;

  if (end - start > DAY * 31) {
    throw new Error("Date range should not be morethan 31 days");
  }

  return [start, end];
};

const checkForValidUserName = (userName) => {
  const user = userData.findIndex((user) => user === userName);
  if (user !== -1) return userName;
  throw new Error("Invalid username");
};

const getChangesets = async (displayName, startTime, endTime) => {
  const urls = [];

  const TWELVE_HOURS = HOUR * 12;
  const baseUrl = "https://api.openstreetmap.org/api/0.6/changesets.json";

  let startedAt = startTime;
  while (startedAt <= endTime) {
    const start = startedAt;
    const end =
      startedAt + TWELVE_HOURS > endTime ? endTime : startedAt + TWELVE_HOURS;

    if (start === end) break;

    const displayNameString = `?display_name=${displayName}&`;
    const timeString = `time=${getISO(start)},${getISO(end)}`;
    const url = `${baseUrl}${displayNameString}${timeString}`;
    urls.push(url);
    startedAt = end;
  }

  let responses = await Promise.all(urls.map((url) => fetch(url)));
  const retryUrls = responses
    .filter((response) => response.status !== 200)
    .map((response) => response.url);

  responses = responses.filter((response) => response.status === 200);
  if (retryUrls.length > 0) {
    const retryResponses = await Promise.all(
      retryUrls.map((url) => fetch(url))
    );
    responses.push(...retryResponses);
  }

  let data = await Promise.all(responses.map((response) => response.json()));
  data = data.flatMap((item) => item.changesets);
  data = data
    .map((item) => {
      for (let [key, value] of Object.entries(item.tags)) item[key] = value;
      delete item.tags;
      return item;
    })
    .sort((a, b) => Date.parse(a.closed_at) - Date.parse(b.closed_at));

  return data;
};

const generateOutput = (changesets) => {
  const output = {
    sources: {},
    hashtags: {},
    comments: {},
  };

  changesets.forEach((changeset) => {
    const { source, hashtags: hashtag, comment } = changeset;

    !output.sources.hasOwnProperty(source)
      ? (output.sources[source] = 1)
      : (output.sources[source] = output.sources[source] + 1);

    !output.hashtags.hasOwnProperty(hashtag)
      ? (output.hashtags[hashtag] = 1)
      : (output.hashtags[hashtag] = output.hashtags[hashtag] + 1);

    !output.comments.hasOwnProperty(comment)
      ? (output.comments[comment] = 1)
      : (output.comments[comment] = output.comments[comment] + 1);
  });

  return output;
};

exports.changesets = async (req, res, next) => {
  const { userName, time } = req.query;
  let [startTime, endTime = null] = time.split(",");

  try {
    const [start, end] = checkTimeDifference(startTime, endTime);
    const user = checkForValidUserName(userName);
    const changesets = await getChangesets(user, start, end);
    const output = generateOutput(changesets);

    res.status(200).json({
      status: "success",
      user: userName,
      changesetsCount: changesets.length,
      output,
    });
  } catch (e) {
    next(e);
  }
};
