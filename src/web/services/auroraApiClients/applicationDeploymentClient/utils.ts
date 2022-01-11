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
      return attemptFallbackMethod(fileContent, version);
    }
  }
  return undefined;
}

function attemptFallbackMethod(fileContent: string, version: string) {
  try {
    let emptyYamlWithVersion = fileContent + `\nversion: ${version}`;
    if (fileContent.endsWith('\n')) {
      emptyYamlWithVersion = fileContent + `version: ${version}`;
    }
    return parseYaml(emptyYamlWithVersion, version);
  } catch {
    return undefined;
  }
}

function parseYaml(fileContent: string, version: string) {
  const parsedApplicationFile = YAML.parseDocument(fileContent);
  parsedApplicationFile.set('version', version);
  return parsedApplicationFile.toString();
}
