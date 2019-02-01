import { getLocalDate, getLocalDatetime, getTimestamp } from './date';

describe('date utility', () => {
  it('should return local date time string given date', () => {
    const date = getLocalDatetime(new Date(2007, 0, 12, 2, 22));
    expect(date).toContain('12');
    expect(date).toContain('01');
    expect(date).toContain('2007');
    expect(date).toContain('02:22');
  });

  it('should return local date time string given string', () => {
    const date = getLocalDatetime(
      'Fri Feb 01 2019 13:05:48 GMT+0100 (Central European Standard Time)'
    );
    expect(date).toContain('01');
    expect(date).toContain('02');
    expect(date).toContain('2019');
    expect(date).toContain('13:05');
  });

  it('should return local date string given date', () => {
    const date = getLocalDate(new Date(2007, 0, 12, 2, 22));
    expect(date).toContain('12');
    expect(date).toContain('01');
    expect(date).toContain('2007');
  });

  it('should return timestamp given date', () => {
    const date = getTimestamp(new Date(2007, 0, 12, 2, 22, 33));
    expect(date).toContain('02:22:33');
  });
});
