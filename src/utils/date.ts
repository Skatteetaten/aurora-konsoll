/**
 * Get formatted timestamp HH:MM:SS
 * @param time Time string that can be converted to Date instance
 * @returns Formatted time HH:MM:SS
 */
export function getTimestamp(time: string | number | Date): string {
  return getLocalDatetime(time, {
    day: undefined,
    month: undefined,
    second: '2-digit',
    year: undefined,
  });
}

export function getLocalDate(time: string | number | Date): string {
  return getLocalDatetime(time, {
    day: '2-digit',
    hour: undefined,
    minute: undefined,
    month: '2-digit',
    year: 'numeric',
  });
}

export function getLocalDatetime(
  date?: string | number | Date,
  override: Intl.DateTimeFormatOptions = {}
): string {
  if (date) {
    return new Date(date).toLocaleString('nb-NO', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...override,
    });
  } else {
    return '-';
  }
}

export function dateValidation(value: any): false | RegExpMatchArray {
  const dateValidator = /^\d{2}[.]\d{2}[.]\d{4}$/;
  const matchValueWithDateValidator =
    typeof value === 'string' && (value as string).match(dateValidator);

  if (matchValueWithDateValidator === null) {
    return false;
  }
  return matchValueWithDateValidator;
}

export function createDate(value: string | null): Date {
  if (value === null) {
    return new Date(0);
  } else {
    const values = value.split('.');
    return new Date(
      Number(values[2]),
      Number(values[1]) - 1,
      Number(values[0])
    );
  }
}
