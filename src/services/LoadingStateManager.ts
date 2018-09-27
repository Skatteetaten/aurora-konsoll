import { ComponentStateHandler } from 'models/ComponentStateHandler';

export interface ILoadingMap {
  [key: string]: boolean;
}

export default class LoadingStateManager<S> extends ComponentStateHandler<S> {
  private state: S;

  constructor(state: S, setState: (state: S) => void) {
    super(setState);
    this.state = state;
  }

  public async withLoading(types: Array<keyof S>, cb: () => any) {
    const setAll = (isLoading: boolean) =>
      types.reduce(
        (acc, t) => ({
          ...acc,
          [t]: isLoading
        }),
        {}
      );

    this.setLoading(setAll(true));

    await cb();

    this.setLoading(setAll(false));
  }

  public setLoading = (loading: ILoadingMap) => {
    const getCurrentLoadingState = (name: string): boolean => {
      if (loading[name] !== undefined) {
        return loading[name];
      }
      return this.state[name];
    };

    Object.keys(loading).forEach(k => {
      this.state[k] = getCurrentLoadingState(k);
    });

    this.handleState(this.state);
  };
}
