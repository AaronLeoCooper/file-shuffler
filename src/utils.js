const fs = require('fs');
const path = require('path');

const prefixNumRegex = /^\d+/;

const getPrefixNum = (file = '') => {
  const prefixNumMatch = file.match(prefixNumRegex);

  return (prefixNumMatch && prefixNumMatch[0]) || '';
};

const isPrefixed = (file = '', separator = '') => {
  const prefixNum = getPrefixNum(file);

  if (!prefixNum) {
    return false;
  }

  const prefixNumLength = prefixNum.length;
  const unprefixedFile = file.slice(prefixNumLength);

  return unprefixedFile.startsWith(separator);
};

function renameFile(dir, file, separator, number, options = {}) {
  const { forceShuffle, dryRun, debug } = options;

  const existingPrefix = isPrefixed(file, separator)
    ? getPrefixNum(file) + separator
    : '';

  const cleanFile = forceShuffle
    ? file
    : file.slice(existingPrefix.length);

  if (existingPrefix && debug) {
    console.log(file, '- stripped to:', cleanFile);
  }

  const origPath = path.join(dir, file);
  const newPath = path.join(dir, `${number}${separator}${cleanFile}`)

  if (debug || dryRun) {
    console.log('Renaming', origPath, 'to', newPath);
  }

  if (dryRun) {
    return;
  }

  return fs.renameSync(origPath, newPath);
}

module.exports = { getPrefixNum, isPrefixed, renameFile };
