import { StateManager } from 'models/StateManager';

type Booleans<T> = { [P in keyof T]: boolean };

class LoadingStateManager<S extends Booleans<S>> extends StateManager<S> {
  public async withLoading(types: Array<keyof S>, cb: () => Promise<any>) {
    const state = this.getState();

    const setAll = (isLoading: boolean) =>
      types.forEach(t => {
        state[t] = isLoading;
      });

    setAll(true);
    this.updateState(state);

    await cb();

    setAll(false);
    this.updateState(state);
  }
}

export default LoadingStateManager;
