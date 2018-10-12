export interface IUnavailableServiceMessage {
  message: string;
  reason: string;
}

export function unavailableServiceMessageCreator(message: string) {
  return (reason: string): IUnavailableServiceMessage => ({
    message,
    reason
  });
}
