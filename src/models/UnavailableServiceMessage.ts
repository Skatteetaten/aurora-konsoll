export interface IUnavailableServiceMessage {
  description: string;
  reason: string;
}

export function unavailableServiceMessageCreator(description: string) {
  return (reason: string): IUnavailableServiceMessage => ({
    description,
    reason
  });
}
