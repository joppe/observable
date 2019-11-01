import { Observer } from '../observer/Observer';
import { Subject } from './Subject';
import { Subscription } from '../observable/Subscription';

export class CurrentValueSubject<T> extends Subject<T> {
    private _currentValue: T;

    constructor(initialValue: T) {
        super();

        this._currentValue = initialValue;
    }

    public next(value: T): void {
        this._currentValue = value;

        super.next(value);
    }

    public subscribe(observer: Observer<T>): Subscription {
        const subscription: Subscription = super.subscribe(observer);

        if (observer.next !== undefined) {
            observer.next(this._currentValue);
        }

        return subscription;
    }
}
