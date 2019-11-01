import { Observable } from '../observable/Observable';

export interface Operator<T, K> {
    (observable: Observable<T>): Observable<K>;
}
