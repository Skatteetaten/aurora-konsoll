import YAML from 'yaml';

export function changeVersionInFile(
  fileName: string,
  fileContent: string,
  version: string
): string | Error {
  if (fileName.endsWith('json')) {
    try {
      return parseJson(fileContent, version);
    } catch {
      return new Error(
        `Could not parse json in file=${fileName} Please check that the file contains valid json`
      );
    }
  } else if (fileName.endsWith('yaml')) {
    try {
      return parseYaml(fileContent, version);
    } catch {
      return new Error(
        `Could not parse yaml in file=${fileName} Please check that the file contains valid yaml`
      );
    }
  }
  return new Error(
    `Not supported file type used in file=${fileName} Please check that the file is either yaml or json`
  );
}
const isEmptyYaml = (content: string) => content.trim() === '---';

function parseYaml(fileContent: string, version: string) {
  YAML.scalarOptions.str.fold.lineWidth = 0;
  if (isEmptyYaml(fileContent)) {
    const emptyYaml = new YAML.Document({});
    emptyYaml.directivesEndMarker = true;
    emptyYaml.contents = { version };
    return emptyYaml.toString();
  }
  const parsedApplicationFile = YAML.parseDocument(fileContent);
  parsedApplicationFile.set('version', version);
  return parsedApplicationFile.toString();
}

function parseJson(fileContent: string, version: string) {
  const parsedApplicationFile: JSON = JSON.parse(fileContent);
  return JSON.stringify(
    { ...parsedApplicationFile, version: version },
    null,
    2
  );
}
