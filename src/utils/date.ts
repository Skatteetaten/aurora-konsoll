/**
 * Get formatted timestamp HH:MM:SS
 * @param time Time string that can be converted to Date instance
 * @returns Formatted time HH:MM:SS
 */
export function getTimestap(time: string): string {
  return getLocalDatetime(time, {
    day: undefined,
    month: undefined,
    second: '2-digit',
    year: undefined
  });
}

export function getLocalDatetime(date?: string, override: any = {}): string {
  if (date) {
    return new Date(date).toLocaleString('nb-NO', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...override
    });
  } else {
    return '-';
  }
}
