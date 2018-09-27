export class ComponentStateHandler<S> {
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

  protected updateState(state: S) {
    this.state = state;
    if (this.isActive) {
      this.onUpdateState(state);
    }
  }
}
