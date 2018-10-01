import StateManager from 'models/StateManager';

export interface IAppError {
  id: number;
  error: Error;
  isActive: boolean;
}

export interface IErrorState {
  errorQueue: IAppError[];
  allErrors: Map<number, IAppError>;
}

class ErrorStateManager extends StateManager<IErrorState> {
  public errorCount = 0;

  public addError(error: Error) {
    const state = this.getState();
    state.errorQueue.unshift({
      error,
      id: this.errorCount++,
      isActive: true
    });
    this.updateState(state);
  }

  public getNextError(): IAppError | undefined {
    const state = this.getState();
    const next = state.errorQueue.pop();
    if (!next) {
      return;
    }
    state.allErrors.set(next.id, next);
    this.updateState(state);
    return next;
  }

  public closeError = (id: number) => {
    const state = this.getState();
    const err = state.allErrors.get(id);
    if (!err) {
      throw new Error('No such error ' + id);
    }
    err.isActive = false;
    this.updateState(state);
  };

  public hasError() {
    return this.getState().errorQueue.length > 0;
  }

  public registerStateUpdater(updater: (errors: IErrorState) => void) {
    this.onUpdateState = updater;
  }
}

const errorSM = new ErrorStateManager(
  { errorQueue: [], allErrors: new Map() },
  () => {
    return;
  }
);

export { errorSM };
export default ErrorStateManager;
