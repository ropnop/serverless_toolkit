const { send } = require('micro');
const _ = require('lodash');
const rawBody = require('raw-body');
const requestIp = require('request-ip');
const slackWebhook = require('slack-webhook');

const WEBHOOK_URL = process.env.SLACK_WEBHOOK;

const slack = new slackWebhook(WEBHOOK_URL);

// These are all added by CF and Zeit, I usually ignore them
const IGNORED_HEADERS = [
  "x-forwarded-host",
  "x-real-ip",
  "x-forwarded-for",
  "x-forwarded-proto",
  "x-now-id",
  "x-now-log-id",
  "x-zeit-co-forwarded-for",
  "cf-ipcountry",
  "cf-ray",
  "cf-visitor",
  "cf-connecting-ip",
  "true-client-ip",
]
const ALL_HEADERS = process.env.ALL_HEADERS || false; // toggle this to show them

// Modify this function to customize the slack message to your liking
const renderSlackMessage = (data) => {
  let headerstext = _.reduce(data.headers, (headerstext, headerval, headername) => {
    return headerstext + `${headername}: ${headerval}\n`;
  }, '');
  return `
*New Request To:* \`${data.host}${data.url}\`
*Request From:* \`${data.ip}\`
*Time (UTC):* \`${data.timestamp}\`
*Request Details:*
\`\`\`
${data.method} ${data.url} HTTP/${data.httpVersion}
${headerstext}
${data.body}
\`\`\`
`
}

module.exports = async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const now = new Date();
  let headers = {};
  if (!ALL_HEADERS) {
    headers = _.reduce(req.headers, (headers, headerval, headername) => {
      if (_.includes(IGNORED_HEADERS, headername)) {
        return headers;
      } else {
        headers[headername] = headerval;
        return headers;
      }
    }, {} );
  } else { headers = req.headers; }

  const data = {
    host: req.headers.host,
    url: req.url,
    httpVersion: req.httpVersion,
    method: req.method,
    headers: headers,
    protocol: req.protocol,
    body: String(await rawBody(req)),
    ip: clientIp,
    timestamp: now.toISOString()
  };

  const message = renderSlackMessage(data);

  try {
    await slack.send(message);
  } catch (err) {
    send(res, 500, err);
  }
  send(res, 404); //return a 404, could return anything here, we captured the req already
}
