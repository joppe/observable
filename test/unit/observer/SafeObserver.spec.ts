import { SafeObserver } from '@apestaartje/observable/observer/SafeObserver';
import { Subscription } from '@apestaartje/observable/observable/Subscription';

type NextableObserver<T> = { next(v: T): void };
type ErrorableObserver<T> = { error(e: Error): void };
type CompletableObserver<T> = { complete(): void };
type CompleteObserver<T> = NextableObserver<T> & ErrorableObserver<T> & CompletableObserver<T>;

describe('SafeObserver', (): void => {
    describe('next', (): void => {
        it('if the observer has no next method, do nothing', (): void => {
            const s: SafeObserver<number> = new SafeObserver<number>({});

            s.next(1);
        });

        it('if next method is defined, call it with the given argument', (): void => {
            const o: NextableObserver<number> = {
                next(v: number): void {
                    // nothing
                },
            };
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            const nextSpy: jasmine.Spy = spyOn(o, 'next');

            s.next(16);

            expect(nextSpy).toHaveBeenCalledWith(16);
        });

        it('when an exception is thrown the observer will unsubscribe and throw an error', (): void => {
            const o: NextableObserver<number> = {
                next(v: number): void {
                    throw new Error('?');
                },
            };
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            s.registerSubscription(u);

            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');

            expect((): void => {
                s.next(16);
            }).toThrow();

            expect(unsubscriptionSpy).toHaveBeenCalled();
        });
    });

    describe('error', (): void => {
        it('if the observer has no error method, do nothing', (): void => {
            const s: SafeObserver<number> = new SafeObserver<number>({});

            s.error(new Error('!'));
        });

        it('if error method is defined, call it with the given error and unsubscribe', (): void => {
            const o: ErrorableObserver<number> = {
                error(err: Error): void {
                    // nothing
                },
            };
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            s.registerSubscription(u);

            const errorSpy: jasmine.Spy = spyOn(o, 'error');
            const e: Error = new Error('??');

            s.error(e);

            expect(errorSpy).toHaveBeenCalledWith(e);
            expect(unsubscriptionSpy).toHaveBeenCalled();
        });

        it('when an exception is thrown the observer will unsubscribe and throw an error', (): void => {
            const e: Error = new Error('??');
            const o: ErrorableObserver<number> = {
                error(err: Error): void {
                    throw e;
                },
            };
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            s.registerSubscription(u);

            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');

            expect((): void => {
                s.error(new Error('**'));
            }).toThrowError('??');

            expect(unsubscriptionSpy).toHaveBeenCalled();
        });
    });

    describe('complete', (): void => {
        it('if the observer has no complete method, do nothing', (): void => {
            const s: SafeObserver<number> = new SafeObserver<number>({});

            s.complete();
        });

        it('if complete method is defined, call it with', (): void => {
            const o: CompletableObserver<number> = {
                complete(): void {
                    // nothing
                },
            };
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            s.registerSubscription(u);

            const completeSpy: jasmine.Spy = spyOn(o, 'complete');

            s.complete();

            expect(completeSpy).toHaveBeenCalled();
            expect(unsubscriptionSpy).toHaveBeenCalled();
        });

        it('when an exception is thrown the observer will unsubscribe and throw an error', (): void => {
            const e: Error = new Error('??');
            const o: CompletableObserver<number> = {
                complete(): void {
                    throw e;
                },
            };
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            s.registerSubscription(u);

            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');

            expect((): void => {
                s.complete();
            }).toThrowError('??');

            expect(unsubscriptionSpy).toHaveBeenCalled();
        });
    });

    describe('unsubscribe', (): void => {
        it('when called and a subscription is registered, unsubscribe it', (): void => {
            const s: SafeObserver<number> = new SafeObserver<number>({});
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            s.registerSubscription(u);

            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');

            s.unsubscribe();

            expect(unsubscriptionSpy).toHaveBeenCalled();
        });

        it('once unsubscribed, next/complete/error won\'t be called anymore', (): void => {
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
            const s: SafeObserver<number> = new SafeObserver<number>(o);
            const u: Subscription = {
                unsubscribe(): void {
                    // nothing
                },
            };
            s.registerSubscription(u);

            const unsubscriptionSpy: jasmine.Spy = spyOn(u, 'unsubscribe');
            const nextSpy: jasmine.Spy = spyOn(o, 'next');
            const errorSpy: jasmine.Spy = spyOn(o, 'error');
            const completeSpy: jasmine.Spy = spyOn(o, 'complete');

            s.unsubscribe();

            s.next(12);
            s.error(new Error('??'));
            s.complete();

            expect(unsubscriptionSpy).toHaveBeenCalled();
            expect(nextSpy).not.toHaveBeenCalled();
            expect(errorSpy).not.toHaveBeenCalled();
            expect(completeSpy).not.toHaveBeenCalled();
        });
    });
});
