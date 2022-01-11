import { changeVersionInFile } from './utils';

describe('utils', () => {
  it('empty json object should return json object with version', () => {
    const changedFile = changeVersionInFile('env/app.json', '{}', '1');

    expect(changedFile).toContain('"version": "1"');
  });

  it('yaml file with property baseFile should return yaml with baseFile and version', () => {
    const changedFile = changeVersionInFile(
      'env/app.yaml',
      '---\nbaseFile: blabla\n',
      'test-snapshot'
    );

    expect(changedFile).toContain('baseFile: blabla');
    expect(changedFile).toContain('version: test-snapshot');
  });

  it('yaml file with only dashes should return yaml with version property', () => {
    const changedFile = changeVersionInFile('env/app.yaml', '---\n', '1');

    expect(changedFile).toContain('version: "1"');
  });

  it('empty yaml file should return yaml with version property', () => {
    const changedFile = changeVersionInFile('env/app.yaml', '', '1');

    expect(changedFile).toContain('version: "1"');
  });

  it('invalid yaml file should return undefined', () => {
    const changedFile = changeVersionInFile(
      'env/app.yaml',
      '---\nbaseFile',
      '1'
    );

    expect(changedFile).toEqual(undefined);
  });

  it('not supported file type should return undefined', () => {
    const changedFile = changeVersionInFile('env/app.xml', '', '1');

    expect(changedFile).toEqual(undefined);
  });
});
