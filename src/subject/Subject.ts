import { Observable } from '../observable/Observable';
import { SafeObserver } from '../observer/SafeObserver';
import { Subscription } from '../observable/Subscription';

export class Subject<T> extends Observable<T> {
    private _observers: SafeObserver<T>[] = [];
    private _isUnsubscribed: boolean = false;

    constructor() {
        super((observer: SafeObserver<T>): Subscription => {
            this._observers = this._observers.concat([observer]);

            return {
                unsubscribe: (): void => {
                    this.unsbuscribeObserver(observer);
                },
            };
        });
    }

    public next(value: T): void {
        if (this._isUnsubscribed) {
            return;
        }

        this._observers.forEach((observer: SafeObserver<T>): void => {
            observer.next(value);
        });
    }

    public complete(): void {
        if (this._isUnsubscribed) {
            return;
        }

        this._observers.forEach((observer: SafeObserver<T>): void => {
            observer.complete();
        });

        this.unsubscribe();
    }

    public error(err: Error): void {
        if (this._isUnsubscribed) {
            return;
        }

        this._observers.forEach((observer: SafeObserver<T>): void => {
            observer.error(err);
        });

        this.unsubscribe();
    }

    public unsubscribe(): void {
        this._isUnsubscribed = true;

        this._observers.forEach((observer: SafeObserver<T>): void => {
            observer.unsubscribe();
        });

        this._observers = [];
    }

    private unsbuscribeObserver(observer: SafeObserver<T>): void {
        this._observers = this._observers.filter((o: SafeObserver<T>): boolean => {
            return o !== observer;
        });

        if (this._observers.length === 0) {
            this.complete();
        }
    }
}
