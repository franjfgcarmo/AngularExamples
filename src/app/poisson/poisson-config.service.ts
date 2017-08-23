import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PoissonConfigService {

  public k$: BehaviorSubject<number> = new BehaviorSubject(15);
  public iterationsPerFrame$: BehaviorSubject<number> = new BehaviorSubject(10);

  public r$: BehaviorSubject<number> = new BehaviorSubject(5);
  public w$: Observable<number> = this.r$.map((radius) => radius / Math.sqrt(2));

  constructor() {
  }
}
