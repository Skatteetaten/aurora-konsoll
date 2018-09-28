export default class StateManager<S> {
  private state: S;
  private isActive = true;
  private onUpdateState: (state: S) => void;

  constructor(state: S, onUpdateState: (state: S) => void) {
    this.state = state;
    this.onUpdateState = onUpdateState;
  }

  public close() {
    this.isActive = false;
  }

  public getState(): S {
    return this.state;
  }

  protected updateState(state: S | ((state: S) => S)) {
    let nextState: S;
    if (state instanceof Function) {
      nextState = state(this.state);
    } else {
      nextState = state;
    }

    this.state = nextState;
    if (this.isActive) {
      this.onUpdateState(nextState);
    }
  }
}
