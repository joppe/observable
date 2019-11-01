import { map } from '@apestaartje/observable/operator/map/map';
import { Observable } from '@apestaartje/observable/observable/Observable';
import { Operator } from '@apestaartje/observable/operator/Operator';
import { SafeObserver } from '@apestaartje/observable/observer/SafeObserver';
import { Subscriber } from '@apestaartje/observable/observable/Subscriber';
import { Subscription } from '@apestaartje/observable/observable/Subscription';

type NextableObserver<T> = { next(v: T): void };
type ErrorableObserver<T> = { error(e: Error): void };
type CompletableObserver<T> = { complete(): void };
type CompleteObserver<T> = NextableObserver<T> & ErrorableObserver<T> & CompletableObserver<T>;

describe('Observable', (): void => {
    let next: (v: number) => void;
    let complete: () => void;
    let error: (err: Error) => void;
    let observable: Observable<number>;
    let safeObserver: SafeObserver<number>;
    let subscriber: Subscriber<number>;
    let subscriberCalled: boolean;
    let subscriberCalledCount: number;

    const observer: CompleteObserver<number> = {
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
    const subscription: Subscription = {
        unsubscribe(): void {
            // nothing
        },
    };

    beforeEach((): void => {
        subscriberCalled = false;
        subscriberCalledCount = 0;

        subscriber = (o: SafeObserver<number>): Subscription => {
            safeObserver = o;
            subscriberCalled = true;
            subscriberCalledCount += 1;

            next = (v: number): void => {
                o.next(v);
            };

            complete = (): void => {
                o.complete();
            };

            error = (err: Error): void => {
                o.error(err);
            };

            return subscription;
        };

        observable = new Observable<number>(subscriber);
    });

    describe('constructor', (): void => {
        it('the subscriber is stored but not executed', (): void => {
            expect(subscriberCalled).toBe(false);
        });
    });

    describe('subscribe', (): void => {
        it('the subscriber is called when the subscribe method is called', (): void => {
            observable.subscribe(observer);

            expect(subscriberCalled).toBe(true);
        });

        it('the data source subscription is unsubscribed when the observer unsubscribes', (): void => {
            const unsubscibeSpy: jasmine.Spy = spyOn(subscription, 'unsubscribe');
            const sub: Subscription = observable.subscribe(observer);

            sub.unsubscribe();

            expect(unsubscibeSpy).toHaveBeenCalled();
        });

        it('when the data source emits a value, that value is passed to the next method of the observer', (): void => {
            const nextSpy: jasmine.Spy = spyOn(observer, 'next');

            observable.subscribe(observer);
            next(9);

            expect(nextSpy).toHaveBeenCalledWith(9);
        });

        it('when finished doesn\'t receive new values via next', (): void => {
            const nextSpy: jasmine.Spy = spyOn(observer, 'next');

            observable.subscribe(observer);
            complete();
            next(88);

            expect(nextSpy).not.toHaveBeenCalled();
        });

        it('when unsubscribed doesn\'t receive new values via next', (): void => {
            const nextSpy: jasmine.Spy = spyOn(observer, 'next');
            const s: Subscription = observable.subscribe(observer);

            s.unsubscribe();
            next(34);

            expect(nextSpy).not.toHaveBeenCalled();
        });

        it('when an error occurs the error method is called', (): void => {
            const errorSpy: jasmine.Spy = spyOn(observer, 'error');
            const e: Error = new Error('?');

            observable.subscribe(observer);
            error(e);

            expect(errorSpy).toHaveBeenCalledWith(e);
        });

        it('an observable is unicast, calls the subscriber for each subscription', (): void => {
            const o2: NextableObserver<number> = {
                next(v: number): void {
                    // nothing
                },
            };
            const nextSpy1: jasmine.Spy = spyOn(observer, 'next');
            const nextSpy2: jasmine.Spy = spyOn(o2, 'next');
            const s1: Subscription = observable.subscribe(observer);
            const s2: Subscription = observable.subscribe(o2);

            s1.unsubscribe();
            next(102);

            expect(subscriberCalledCount).toEqual(2);
            expect(nextSpy1).not.toHaveBeenCalled();
            expect(nextSpy2).toHaveBeenCalledWith(102);
        });
    });

    describe('pipe', (): void => {
        it('applies the given operators to the emitted values', (): void => {
            const nextSpy: jasmine.Spy = spyOn(observer, 'next');
            const double: Operator<number, number> = map<number, number>((value: number): number => {
                return value * 2;
            });
            const isMultipleOf3: Operator<number, boolean> = map<number, boolean>((value: number): boolean => {
                return value % 3 === 0;
            });
            const result: Observable<boolean> = observable.pipe(
                double,
                isMultipleOf3,
            );

            result.subscribe(observer);

            next(3);
            expect(nextSpy).toHaveBeenCalledWith(true);
            next(16);
            expect(nextSpy).toHaveBeenCalledWith(false);
        });
    });
});
