import { ComponentStateHandler } from 'models/ComponentStateHandler';

export interface ILoadingMap {
  [key: string]: boolean;
}

export default class LoadingService<S> extends ComponentStateHandler<S> {
  private state: S;

  constructor(state: S, setState: (state: S) => void) {
    super(setState);
    this.state = state;
  }

  public async withLoading(type: keyof S, cb: () => any) {
    this.setLoading({
      [type]: true
    });

    await cb();

    this.setLoading({
      [type]: false
    });
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
