import { changeVersionInFile } from './utils';

describe('utils', () => {
  it('empty json object should return json object with version', () => {
    const changedFile = changeVersionInFile('env/app.json', '{}', '1');

    expect(changedFile).toContain('"version": "1"');
  });

  it('invalid json object should return error message', () => {
    const changedFile = changeVersionInFile('env/app.json', '{version}', '1');

    expect(changedFile).toEqual(
      Error(
        'Could not parse json in file=env/app.json Please check that the file contains valid json'
      )
    );
  });

  it('yaml file with property baseFile and comment should return yaml with baseFile, comment, and version', () => {
    const changedFile = changeVersionInFile(
      'env/app.yaml',
      '---\n#the baseFile used\nbaseFile: app.yaml\n',
      'test-snapshot'
    );

    expect(changedFile).toContain('---');
    expect(changedFile).toContain('#the baseFile used');
    expect(changedFile).toContain('baseFile: app.yaml');
    expect(changedFile).toContain('version: test-snapshot');
  });

  it('yaml file with only dashes should return yaml with version property', () => {
    const changedFile = changeVersionInFile('env/app.yaml', '---\n', '1');

    expect(changedFile).toContain('---');
    expect(changedFile).toContain('version: "1"');
  });

  it('empty yaml file should return error message', () => {
    const changedFile = changeVersionInFile('env/app.yaml', '', '1');

    expect(changedFile).toEqual(
      Error(
        'Could not parse yaml in file=env/app.yaml Please check that the file contains valid yaml'
      )
    );
  });

  it('invalid yaml file should return error message', () => {
    const changedFile = changeVersionInFile(
      'env/app.yaml',
      '---\nbaseFile',
      '1'
    );

    expect(changedFile).toEqual(
      Error(
        'Could not parse yaml in file=env/app.yaml Please check that the file contains valid yaml'
      )
    );
  });

  it('not supported file type should return error message', () => {
    const changedFile = changeVersionInFile('env/app.xml', '', '1');

    expect(changedFile).toEqual(
      Error(
        'Not supported file type used in file=env/app.xml Please check that the file is either yaml or json'
      )
    );
  });
});
