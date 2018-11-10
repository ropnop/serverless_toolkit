const express = require('express');
const os = require('os');
const { promisify } = require('util');
const { spawn } = require('child_process');
const exec = promisify(require('child_process').exec);

const app = express();

const runScan = async (host) => {
  let results = '';
  const command = spawn('nmap', ['-Pn', '-F', '-sT', host]);
  for await (const data of command.stdout) {
    results = results + data;
  }
  return results.toString();
}


app.get('/', async(req, res) => {
  const host = req.query.host;
  if (!host) {
    return res.send('Must include a host param to scan');
  }
  let results;
  try {
    console.log(`scanning: ${host}`);
    results = await runScan(host);
    res.send(results);
  } catch (err) {
    console.log(`error: ${err}`);
    res.set(500);
    res.send(err);
  }
});


app.listen(3000, () => console.log("listening on 3000"));
