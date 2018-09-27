import { ComponentStateHandler } from 'models/ComponentStateHandler';

export interface ILoadingMap {
  [key: string]: boolean;
}

export default class LoadingStateManager<S> extends ComponentStateHandler<S> {
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
    const loadingState = this.getState();
    const getCurrentLoadingState = (name: string): boolean => {
      if (loading[name] !== undefined) {
        return loading[name];
      }
      return loadingState[name];
    };

    Object.keys(loading).forEach(k => {
      loadingState[k] = getCurrentLoadingState(k);
    });

    this.updateState(loadingState);
  };
}
