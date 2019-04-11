type TransformFunc<T, K extends keyof T> = (v: NonNullable<T[K]>) => any;
type AddNonNullFunc<T> = <K extends keyof T>(
  key: K,
  as: string | undefined,
  to?: TransformFunc<T, K>
) => void;

export class InfoContentValues {
  private values: Record<string, any>;

  constructor() {
    this.values = {};
  }

  public get(): Record<string, any> {
    return {
      ...this.values
    };
  }

  public add<T, K extends keyof T>(
    obj: T,
    key: K,
    as: string | undefined,
    to?: (v: NonNullable<T[K]>) => any
  ): void {
    if (!obj[key]) {
      return;
    }

    const value = to ? to(obj[key] as NonNullable<T[K]>) : obj[key];

    if (as) {
      this.values[as] = value;
    } else {
      this.values[`${key}`] = value;
    }
  }

  public addFrom<T>(
    obj: T | undefined,
    fn: (add: AddNonNullFunc<T>) => void
  ): void {
    if (obj) {
      fn(this.addFor(obj));
    }
  }

  private addFor<T>(obj: T): AddNonNullFunc<T> {
    return <K extends keyof T>(
      key: K,
      as: string | undefined,
      to?: (v: NonNullable<T[K]>) => any
    ) => {
      this.add(obj, key, as, to);
    };
  }
}
