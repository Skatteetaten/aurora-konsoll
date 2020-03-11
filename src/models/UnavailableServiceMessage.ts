export interface IUnavailableServiceMessage {
  description: string;
  reason: string;
  type?: 'info' | 'warning';
}

export function unavailableServiceMessageCreator(description: string) {
  return (
    reason: string,
    type?: 'info' | 'warning'
  ): IUnavailableServiceMessage => ({
    description,
    reason,
    type
  });
}
