import { prettifyJSON } from './string';

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
