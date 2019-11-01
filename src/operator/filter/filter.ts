import { FilterFunction } from './FilterFunction';
import { Observable } from '../../observable/Observable';
import { Operator } from '../Operator';
import { SafeObserver } from '../../observer/SafeObserver';
import { Subscription } from '../../observable/Subscription';

export function filter<T>(predicate: FilterFunction<T>): Operator<T, T> {
    return (observable: Observable<T>): Observable<T> => {
        return new Observable<T>((observer: SafeObserver<T>): Subscription => {
            return observable.subscribe({
                next: (value: T): void => {
                    if (predicate(value)) {
                        observer.next(value);
                    }
                },
                error(err: Error): void {
                    observer.error(err);
                },
                complete(): void {
                    observer.complete();
                },
            });
        });
    };
}
