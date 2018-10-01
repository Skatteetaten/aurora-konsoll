import StateManager from 'models/StateManager';

type Booleans<T> = { [P in keyof T]: boolean };

class LoadingStateManager<S extends Booleans<S>> extends StateManager<S> {
  public async withLoading(types: Array<keyof S>, cb: () => Promise<any>) {
    this.updateSelected(types, true);
    await cb();
    this.updateSelected(types, false);
  }

  public updateSelected(selected: Array<keyof S>, isLoading: boolean) {
    this.updateState(state => ({
      ...(state as any),
      ...this.setSelected(selected, isLoading)
    }));
  }

  private setSelected(selected: Array<keyof S>, isLoading: boolean) {
    return selected.reduce(
      (acc, s) => ({
        ...acc,
        [s]: isLoading
      }),
      {}
    );
  }
}

export default LoadingStateManager;
