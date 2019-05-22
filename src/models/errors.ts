export interface IAppError {
  id: number;
  error: Error;
  isActive: boolean;
}

export interface IErrors {
  errorQueue: IAppError[];
  allErrors: Map<number, IAppError>;
}
