export interface ILoadingMap {
  [key: string]: boolean;
}

export default class LoadingService<K> {
  private state: K;
  private setState: (state: K) => void;

  constructor(state: K, setState: (state: K) => void) {
    this.state = state;
    this.setState = setState;
  }

  public async withLoading(type: keyof K, cb: () => any) {
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

    this.setState(this.state);
  };
}
