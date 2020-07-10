import {
  createDate,
  dateValidation,
  getLocalDate,
  getLocalDatetime,
  getTimestamp
} from './date';

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

  it('should return date given legit date', () => {
    const date = dateValidation('12.04.2018');
    expect(date).toContain('12.04.2018');
  });

  it('should return false given wrong date format', () => {
    const date = dateValidation('12.4.18');
    expect(date).toBeFalsy();
  });

  it('should return given date in string format to return same date in date format', () => {
    const date = createDate('12.01.2007');
    expect(date).toEqual(new Date(2007, 0, 12, 0, 0));
  });

  it('should return NaN given a not legit time format as string', () => {
    expect(isNaN(createDate('test').getTime())).toBe(true);
  });
});
