import { filter } from '@apestaartje/observable/operator/filter/filter';
import { Observable } from '@apestaartje/observable/observable/Observable';
import { Operator } from '@apestaartje/observable/operator/Operator';
import { SafeObserver } from '@apestaartje/observable/observer/SafeObserver';
import { Subscriber } from '@apestaartje/observable/observable/Subscriber';
import { Subscription } from '@apestaartje/observable/observable/Subscription';

type NextableObserver<T> = { next(v: T): void };
type ErrorableObserver<T> = { error(e: Error): void };
type CompletableObserver<T> = { complete(): void };
type CompleteObserver<T> = NextableObserver<T> & ErrorableObserver<T> & CompletableObserver<T>;

describe('filter', (): void => {
    let next: (v: number) => void;
    let complete: () => void;
    let error: (err: Error) => void;
    let observable: Observable<number>;
    let subscriber: Subscriber<number>;

    beforeEach((): void => {
        subscriber = (o: SafeObserver<number>): Subscription => {
            next = (v: number): void => {
                o.next(v);
            };

            complete = (): void => {
                o.complete();
            };

            error = (err: Error): void => {
                o.error(err);
            };

            return {
                unsubscribe(): void {
                    // nothing
                },
            };
        };

        observable = new Observable<number>(subscriber);
    });

    it('only emits values that are not filtered out', (): void => {
        const f: Operator<number, number> = filter<number>((value: number): boolean => {
            return value % 2 === 0;
        });
        const o: CompleteObserver<number> = {
            next(v: number): void {
                // nothing
            },
            error(e: Error): void {
                // nothing
            },
            complete(): void {
                // nothing
            },
        };
        const filtered: Observable<number> = f(observable);
        const nextSpy: jasmine.Spy = spyOn(o, 'next');

        filtered.subscribe(o);

        next(0);
        expect(nextSpy).toHaveBeenCalledWith(0);
        nextSpy.calls.reset();
        next(1);
        expect(nextSpy).not.toHaveBeenCalled();
        nextSpy.calls.reset();
        next(16);
        expect(nextSpy).toHaveBeenCalledWith(16);
    });
});
