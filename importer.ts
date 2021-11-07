import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// stolen logic from addfrog.js, will mass import blindly any files in _temp

// hash + filename validation
const reg = new RegExp('^[0-9a-f]{40}\\.(png|jpg|gif)$');

const frogs = fs.readdirSync('./frogs/_temp');

console.log(frogs.length);

for (const tempPath of frogs) {

  // pull the temp file from fs
  const tempFileBuffer = fs.readFileSync(path.resolve(__dirname, 'frogs/_temp', tempPath));

  // get sha1 hash
  const hashSum = crypto.createHash('sha1');
  hashSum.update(tempFileBuffer);
  const frogHash = hashSum.digest('hex');
  const frogExtension = path.extname(tempPath);
  const frogFileName = `${frogHash}${frogExtension}`;

  // validate the name of new frog
  if (!reg.test(frogFileName)) {
    console.log(`${frogFileName} failed validation`);
  }
  else {
    const frogAcceptedPath = path.resolve(__dirname, 'frogs', frogFileName);
    fs.writeFileSync(frogAcceptedPath, tempFileBuffer);
  }


}