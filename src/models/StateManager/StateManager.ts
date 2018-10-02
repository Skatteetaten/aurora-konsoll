export default class StateManager<S> {
  protected onUpdateState: (state: S) => void;
  private state: S;
  private isActive = true;

  constructor(initState: S, onUpdateState: (state: S) => void) {
    this.state = initState;
    this.onUpdateState = onUpdateState;
  }

  public close() {
    this.isActive = false;
  }

  public getState(): S {
    return this.copy(this.state);
  }

  protected updateState(state: S | ((state: S) => S)) {
    let nextState: S;
    if (state instanceof Function) {
      nextState = state(this.getState());
    } else {
      nextState = state;
    }

    this.state = nextState;
    if (this.isActive) {
      this.onUpdateState(nextState);
    }
  }

  private copy(state: S): S {
    return Object.assign({}, state);
  }
}
