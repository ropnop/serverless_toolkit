const _ = require('lodash');
const rawBody = require('raw-body');
const requestIp = require('request-ip');

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
  "x-vercel-deployment-url",
  "x-vercel-forwarded-for",
  "x-vercel-id",
  "x-forwarded-port"
]
const ALL_HEADERS = process.env.ALL_HEADERS || true; // toggle this to hide them

const CORS_ALLOWED_HEADERS = [
  "accept",
  "accept-language",
  "content-language",
  "content-type",
  "dpr",
  "downlink",
  "save-data",
  "viewport-width",
  "width",
  "host",
  "origin",
  "user-agent",
  "connection",
  ...IGNORED_HEADERS
]


module.exports = async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
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
    url: req.url,
    method: req.method,
    headers: headers,
    body: String(await rawBody(req)),
    ip: clientIp
  };
  const origin = req.headers.origin || "*";

  customHeaders = req.headers["access-control-request-headers"] || "";
  customMethods = req.headers["access-control-request-method"] || "";

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', "true");
  if (customHeaders) {
    res.setHeader('Access-Control-Allow-Headers', customHeaders);
  }
  if (customMethods) {
    res.setHeader('Access-Control-Allow-Methods', customMethods)
  }
  
  return res.status(200).send(data);
}
