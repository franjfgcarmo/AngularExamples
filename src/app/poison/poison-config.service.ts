import {Injectable} from '@angular/core';

@Injectable()
export class PoisonConfigService {

  public k = 15; // iterations

  private _r = 10; // minimal distance between points
  private _w;

  constructor() {
  }

  set r(r: number) {
    this._r = r;
    this._w = null;
  }

  get r() {
    return this._r;
  }

  // cell width
  get w() {
    if (!this._w) {
      this._w = this.r / Math.sqrt(2.);
    }
    return this._w;
  }

}
