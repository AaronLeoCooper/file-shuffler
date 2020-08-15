#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const { getPrefixNum, isPrefixed, renameFile } = require('./src/utils');

const targetDir = yargs.argv._[0] || '.';
const dir = path.resolve(process.cwd(), targetDir);

const defaultSeparator = '__';
const separator = yargs.argv.s || yargs.argv.separator || defaultSeparator;

const getBooleanFlag = (flag) => [true, 'true', 'yes'].includes(flag);

const forceShuffle = getBooleanFlag(yargs.argv.force);
const dryRun = getBooleanFlag(yargs.argv.dry);
const debug = getBooleanFlag(yargs.argv.debug);

if (debug) {
  console.log({
    dir,
    separator,
    forceShuffle,
    dryRun,
    debug
  });
}

if (!fs.existsSync(dir)) {
  console.error(`${dir} directory doesn't exist`);
  process.exit(1);
  return;
}

const files = fs.readdirSync(dir);
const indexes = [...files.keys()];

for (let a = indexes.slice(), i = a.length; i--; ) {
  const randomNum = a.splice(
    Math.floor(Math.random() * (i + 1)),
    1
  )[0] + 1;

  const paddedNumber = String(randomNum).padStart(
    String(files.length).length,
    '0'
  );

  renameFile(dir, files[i], defaultSeparator, paddedNumber, {
    forceShuffle,
    dryRun,
    debug
  });
}

console.log('Shuffling complete!');
