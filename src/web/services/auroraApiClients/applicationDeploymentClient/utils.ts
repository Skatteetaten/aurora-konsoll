import YAML from 'yaml';

export function changeVersionInFile(
  fileName: string,
  fileContent: string,
  version: string
) {
  if (fileName.endsWith('json')) {
    const parsedApplicationFile: JSON = JSON.parse(fileContent);
    return JSON.stringify(
      { ...parsedApplicationFile, version: version },
      null,
      2
    );
  }
  try {
    const parsedApplicationFile = YAML.parseDocument(fileContent);
    parsedApplicationFile.set('version', version);
    return parsedApplicationFile.toString();
  } catch {
    return undefined;
  }
}
