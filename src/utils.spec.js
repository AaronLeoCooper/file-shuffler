const fs = require('fs');

const { getPrefixNum, isPrefixed, getFiles, renameFile } = require('./utils');

jest.mock('fs', () => ({
  renameSync: jest.fn((origPath, newPath) => ({ origPath, newPath }))
}));

describe('getPrefixNum', () => {
  it('should return an empty string when nothing is passed', () => {
    expect(getPrefixNum()).toBe('');
  });

  it('should return an empty string when file starts with a letter', () => {
    expect(getPrefixNum('a123')).toBe('');
  });

  it('should return an empty string when file starts with a symbol', () => {
    expect(getPrefixNum('_123')).toBe('');
  });

  it('should return the prefix when file starts with a number', () => {
    expect(getPrefixNum('123--')).toBe('123');
  });
});

describe('isPrefixed', () => {
  it('should return false when nothing is passed', () => {
    expect(isPrefixed()).toBe(false);
  });

  it('should return false when file starts with a letter', () => {
    expect(isPrefixed('a123')).toBe(false);
  });

  it('should return false when file starts with a symbol', () => {
    expect(isPrefixed('_123')).toBe(false);
  });

  it('should return true when file starts with a number', () => {
    expect(isPrefixed('123')).toBe(true);
  });

  it('should return false when file has no matching separator', () => {
    expect(isPrefixed('123--abc', '__')).toBe(false);
  });

  it('should return true when file has matching separator', () => {
    expect(isPrefixed('123--abc', '-')).toBe(true);
  });
});

describe('getFiles', () => {
  it('should return an empty array when nothing is passed', () => {
    expect(getFiles()).toEqual([]);
  });

  it('should return an array with invalid values removed', () => {
    expect(getFiles([
      null,
      { isFile: () => false },
      undefined
    ])).toEqual([]);
  });

  it('should return an array of file names', () => {
    expect(getFiles([
      { isFile: () => true, name: '1.txt' },
      { isFile: () => false, name: '2.txt' },
      { isFile: () => true, name: '3.txt' }
    ])).toEqual(['1.txt', '3.txt']);
  });

  it('should return an array of file names with a matching extension when passed', () => {
    expect(getFiles([
      { isFile: () => true, name: '1.txt' },
      { isFile: () => true, name: '2.png' },
      { isFile: () => true, name: '3.txt' }
    ], '.png')).toEqual(['2.png']);
  });
});

describe('renameFile', () => {
  const toPosix = (p) => p.replace(/\\/g, '/');

  it('should prepend file with a number', () => {
    const { origPath, newPath } = renameFile('/my/dir', 'file.txt', '~~', '05');

    expect(toPosix(origPath)).toBe('/my/dir/file.txt');
    expect(toPosix(newPath)).toBe('/my/dir/05~~file.txt');
  });

  it('should replace existing prefix with new one', () => {
    const { origPath, newPath } = renameFile('/my/dir', '007~~file.txt', '~~', '05');

    expect(toPosix(origPath)).toBe('/my/dir/007~~file.txt');
    expect(toPosix(newPath)).toBe('/my/dir/05~~file.txt');
  });

  it('should not replace existing prefix if separator is different', () => {
    const { origPath, newPath } = renameFile('/my/dir', '007~~file.txt', '++', '05');

    expect(toPosix(origPath)).toBe('/my/dir/007~~file.txt');
    expect(toPosix(newPath)).toBe('/my/dir/05++007~~file.txt');
  });

  it('should not replace existing prefix if forceShuffle is set', () => {
    const { origPath, newPath } = renameFile('/my/dir', '007~~file.txt', '~~', '005', {
      forceShuffle: true
    });

    expect(toPosix(origPath)).toBe('/my/dir/007~~file.txt');
    expect(toPosix(newPath)).toBe('/my/dir/005~~007~~file.txt');
  });

  it('should not actually rename file if dryRun is set', () => {
    renameFile('/my/dir', 'file.txt', '~~', '05', {
      dryRun: true
    });

    expect(fs.renameSync).not.toHaveBeenCalled();
  });
});
