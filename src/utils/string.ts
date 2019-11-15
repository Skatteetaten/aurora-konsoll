/**
 * Helper function to prettify JSON
 * @param value JSON-string or plain object to prettify
 * @returns Prettified JSON with 2 space indent or undefined if value can't be
 * parsed.
 */
export function prettifyJSON(value: string | object): string | undefined {
  try {
    return parseAndStringify(value);
  } catch (e) {
    return;
  }
}

function parseAndStringify(value: string | object): string {
  if (typeof value === 'object') {
    return stringify(value);
  } else {
    return stringify(JSON.parse(value));
  }
}

export function isEqualObjects(obj1: any, obj2: any): boolean {
  return stringify(obj1) === stringify(obj2);
}

export function stringify(value: any): string {
  return JSON.stringify(value, undefined, '  ');
}

export function stringContainsHtml(str?: string): boolean {
  if (!str) {
    return false;
  }

  return !(str || '')
    .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, '')
    .replace(/(<([^>]+)>)/gi, '')
    .trim();
}
