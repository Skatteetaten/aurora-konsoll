import { prettifyJSON, stringContainsHtml } from './string';

describe('string utils', () => {
  describe('prettifyJSON', () => {
    it('should stringify and prettify object with 2 indent', () => {
      const test = {
        foo: 'bar',
        fooBar: {
          baz: 'foo'
        }
      };
      expect(prettifyJSON(test)).toBe(`{
  "foo": "bar",
  "fooBar": {
    "baz": "foo"
  }
}`);
    });

    it('should parse, stringify and prettify JSON-string with 2 indent', () => {
      const test = `{"foo":"bar","fooBar":{"baz":"foo"}}`;
      expect(prettifyJSON(test)).toBe(`{
  "foo": "bar",
  "fooBar": {
    "baz": "foo"
  }
}`);
    });

    it('should return undefined when string contains non JSON', () => {
      const test = `<body>fail</body>`;
      expect(prettifyJSON(test)).toBeUndefined();
    });
  });

  describe('stringContainsHtml', () => {
    it('should return true when string contains HTML', () => {
      const stringWithHtml =
        '<div className="input-wrapper"><TextField name="name" label="label"/></div>';
      expect(stringContainsHtml(stringWithHtml)).toBeTruthy();
    });

    it('should return false when string does not contain HTML', () => {
      const stringWithoutHtml = 'text without html';
      expect(stringContainsHtml(stringWithoutHtml)).toBeFalsy();
    });
  });
});
