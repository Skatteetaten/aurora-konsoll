// Taken from http://www.typescriptlang.org/docs/handbook/advanced-types.html
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;