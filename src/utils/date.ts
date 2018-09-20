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
