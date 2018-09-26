export class ComponentStateHandler<S> {
  protected isActive = true;
  private updateState: (state: S) => void;

  constructor(updateState: (state: S) => void) {
    this.updateState = updateState;
  }

  public close() {
    this.isActive = false;
  }

  protected handleState(state: S) {
    if (this.isActive) {
      this.updateState(state);
    }
  }
}
