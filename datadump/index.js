const express = require('express');
const rawBody = require('raw-body');
const requestIp = require('request-ip');
const uuidv4 = require('uuid/v4');
const { WebClient } = require('@slack/client');

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

if (!SLACK_TOKEN || !SLACK_CHANNEL) {
  throw new Error("Must provide Slack API token and Channel ID");
}

const web = new WebClient(SLACK_TOKEN);

const app = express();

const ipMiddleware = (req, res, next) => {
  // let clientIp;
  if (req.header('cf-connecting-ip')){
    req.clientIp = req.header('cf-connecting-ip'); // I want to always give priority to this header
  } else {
    req.clientIp = requestIp.getClientIp(req); // if it's not there then fall back
  }
  next();
};

const filenameMiddleware = (req, res, next) => {
  // if a path is scpecified, that will be the filename, otherwise it will be a uuid
  // this lets you quickly define a memorable filename if you want by just choosing where to POST
  let filename;
  if (req.path.length > 1) {
    req.filename = encodeURIComponent(req.path.slice(1));
  } else {
    req.filename = uuidv4();
  }
  next();
}

app.use(ipMiddleware);
app.use(filenameMiddleware);

// Modify this function to customize the slack message to your liking
const renderSlackComment = (data) => {
  return `
*New Request To:* \`${data.host}${data.url}\`
*Request From:* \`${data.ip}\`
*Time (UTC):* \`${data.timestamp}\`
*Filename: * \`${data.filename}\`
`
}

app.post('*', async (req, res) => {
  // if path is specified, make that the filename, else a uuid
  const now = new Date();
  const bodyData = await rawBody(req);
  const data = {
    host: req.headers.host,
    url: req.url,
    ip: req.clientIp,
    timestamp: now.toISOString(),
    filename: req.filename
  };
  const slackComment = renderSlackComment(data);
  try {
    await web.files.upload({
      filename: data.filename,
      file: bodyData,
      initial_comment: slackComment,
      channels: SLACK_CHANNEL
    });
    res.end();
  } catch (err) {
    console.log(JSON.stringify(err));
    res.end();
  }
});

module.exports = app;