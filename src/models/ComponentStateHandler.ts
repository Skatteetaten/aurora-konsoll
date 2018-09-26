export class ComponentStateHandler<K> {
  protected isActive = true;
  private updateState: (state: K) => void;

  constructor(updateState: (state: K) => void) {
    this.updateState = updateState;
  }

  public close() {
    this.isActive = false;
  }

  protected handleState(state: K) {
    if (this.isActive) {
      this.updateState(state);
    }
  }
}
