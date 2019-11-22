import { Observable } from '@apestaartje/observable/observable';
import { Subject } from '@apestaartje/observable/subject/Subject';
import { Subscription } from '@apestaartje/observable/observable/Subscription';

type NextableObserver<T> = { next(v: T): void };

describe('Subject', (): void => {
    const observer1: NextableObserver<number> = {
        next(v: number): void {
            // nothing
        },
    };
    const observer2: NextableObserver<number> = {
        next(v: number): void {
            // nothing
        },
    };

    it('is an observable with multicast', (): void => {
        const nextSpy1: jasmine.Spy = spyOn(observer1, 'next');
        const nextSpy2: jasmine.Spy = spyOn(observer2, 'next');
        const subject: Subject<number> = new Subject();

        subject.subscribe(observer1);
        subject.subscribe(observer2);
        subject.next(33);

        expect(nextSpy1).toHaveBeenCalledWith(33);
        expect(nextSpy2).toHaveBeenCalledWith(33);
    });

    it('when all observers are unsubscribed it will complete', (): void => {
        const subject: Subject<number> = new Subject();
        const completeSpy: jasmine.Spy = spyOn(subject, 'complete');
        const subscription1: Subscription = subject.subscribe(observer1);
        const subscription2: Subscription = subject.subscribe(observer2);

        subject.next(33);
        subscription1.unsubscribe();
        subscription2.unsubscribe();

        expect(completeSpy).toHaveBeenCalled();
    });

    it('when unsubscribe is called on subject all observables are unsubscribed', (): void => {
        const subject: Subject<number> = new Subject();
        const completeSpy: jasmine.Spy = spyOn(subject, 'complete');

        subject.subscribe(observer1);
        subject.subscribe(observer2);

        subject.next(33);
        subject.unsubscribe();

        expect(completeSpy).toHaveBeenCalled();
    });

    fit('asObservable', (): void => {
        const subject: Subject<number> = new Subject();
        const observable: Observable<number> = subject.asObservable();
        const nextSpy1: jasmine.Spy = spyOn(observer1, 'next');

        subject.next(1);

        const subscription: Subscription = observable.subscribe(observer1);

        expect(nextSpy1).not.toHaveBeenCalled();

        subject.next(1974);

        expect(nextSpy1).toHaveBeenCalledWith(1974);

        subscription.unsubscribe();

        subject.next(23);

        expect(nextSpy1).toHaveBeenCalledTimes(1);
    });
});
