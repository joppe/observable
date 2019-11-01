import { fromElement } from '@apestaartje/observable/observable/element/fromElement';
import { Observable } from '@apestaartje/observable/observable/Observable';
import {Subscription} from '@apestaartje/observable/observable';

type NextableObserver<T> = { next(v: T): void };
type ErrorableObserver<T> = { error(e: Error): void };
type CompletableObserver<T> = { complete(): void };
type CompleteObserver<T> = NextableObserver<T> & ErrorableObserver<T> & CompletableObserver<T>;

describe('fromElement', (): void => {
    let el: HTMLAnchorElement;

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

    beforeEach((): void => {
        el = document.createElement('a');
    });

    it('return an observable that emits values when the event occurs', (): void => {
        const observable: Observable<Event> = fromElement(el, 'click');
        const nextSpy: jasmine.Spy = spyOn(observer, 'next');

        observable.subscribe(observer);
        el.click();

        expect(nextSpy).toHaveBeenCalled();
    });

    it('when unsubscribed, the event listener will be removed', (): void => {
        const observable: Observable<Event> = fromElement(el, 'click');
        const removeEventListenerSpy: jasmine.Spy = spyOn(el, 'removeEventListener');
        const subscription: Subscription = observable.subscribe(observer);

        el.click();
        subscription.unsubscribe();

        expect(removeEventListenerSpy).toHaveBeenCalled();
    });
});
