import {mapWorker} from '../../operator/map-worker';
import {Observable} from 'rxjs/Observable';

Observable.prototype.mapWorker = mapWorker;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    mapWorker: typeof mapWorker;
  }
}
