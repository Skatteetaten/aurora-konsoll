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
  } else if (fileName.endsWith('yaml')) {
    try {
      return parseYaml(fileContent, version);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function parseYaml(fileContent: string, version: string) {
  const parsedApplicationFile = YAML.parse(fileContent) ?? {};
  parsedApplicationFile.version = version;
  return YAML.stringify(parsedApplicationFile);
}
