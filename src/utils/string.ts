/**
 * Helper function to prettify JSON
 * @param value JSON-string or plain object to prettify
 * @returns Prettified JSON with 2 space indent.
 */
export function prettifyJSON(value: string | object): string {
  return parseAndStringify(value);
}

function parseAndStringify(value: string | object): string {
  if (typeof value === 'object') {
    return stringify(value);
  } else {
    return stringify(JSON.parse(value));
  }
}

function stringify(value: any): string {
  return JSON.stringify(value, undefined, ' ');
}
