export class Tuple<T> {
  constructor(public t0: T, public  t1: T) {
  }
}

export function tuple<T>(t0: T, t1: T) {
  return new Tuple(t0, t1);
}
