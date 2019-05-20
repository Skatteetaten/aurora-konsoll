export interface IAppError {
  id: number;
  error: Error;
  isActive: boolean;
}

export interface IErrorState {
  errorQueue: IAppError[];
  allErrors: Map<number, IAppError>;
}