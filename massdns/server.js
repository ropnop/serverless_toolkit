const { buffer, send } = require('micro');
const os = require('os');
const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);
const exec = promisify(require('child_process').exec);

const tmpdir = os.tmpdir();

module.exports = async (req, res) => {
  if (req.method != "POST") {
    return `To use this function, POST a newline delimited list of domains to resolve. E.g. \`curl -X POST --data-binary \"@domains.txt\" ${req.headers.host} \``
  }
  const buf = await buffer(req);
  await writeFile(`${tmpdir}/domains.txt`, buf)
  try {
    const { stdout, stderr } = await exec(`massdns -r /massdns-master/lists/resolvers.txt -o J ${tmpdir}/domains.txt`);
    let arrayString = stdout.replace(/\n$/, "").replace(/\n/g, ",");
    let answers = `[ ${arrayString} ]`;
    return JSON.parse(answers);
  } catch (err) {
    send(res, 500, err);
  }

}
