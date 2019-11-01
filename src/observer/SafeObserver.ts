import { Observer } from './Observer';
import { Subscription } from '../observable/Subscription';

export class SafeObserver<T> implements Observer<T> {
    private _isUnsubscribed: boolean = false;
    private readonly _observer: Observer<T>;
    private _subscription: Subscription | undefined;

    constructor(observer: Observer<T>) {
        this._observer = observer;
    }

    public next(value: T): void {
        // only try to next if you're subscribed have a handler
        if (!this._isUnsubscribed && this._observer.next !== undefined) {
            try {
                this._observer.next(value);
            } catch (err) {
                // if the provided handler errors, teardown resources, then throw
                this.unsubscribe();

                throw err;
            }
        }
    }

    public error(err: Error): void {
        // only try to emit error if you're subscribed and have a handler
        if (!this._isUnsubscribed && this._observer.error !== undefined) {
            try {
                this._observer.error(err);
            } catch (e2) {
                // if the provided handler errors, teardown resources, then throw
                this.unsubscribe();

                throw e2;
            }
        }

        this.unsubscribe();
    }

    public complete(): void {
        // only try to emit completion if you're subscribed and have a handler
        if (!this._isUnsubscribed && this._observer.complete !== undefined) {
            try {
                this._observer.complete();
            } catch (err) {
                // if the provided handler errors, teardown resources, then throw
                this.unsubscribe();

                throw err;
            }
        }

        this.unsubscribe();
    }

    /**
     * Register the subscription to the data source.
     * The subscription will be unsubscribed when the subscription to the oberver is unsubscribed.
     */
    public registerSubscription(subscription: Subscription): void {
        this._subscription = subscription;
    }

    public unsubscribe(): void {
        this._isUnsubscribed = true;

        if (this._subscription !== undefined) {
            this._subscription.unsubscribe();
        }
    }
}
