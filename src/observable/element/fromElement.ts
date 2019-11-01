import { Observable } from '../Observable';
import { SafeObserver } from '../../observer/SafeObserver';
import { Subscription } from '../Subscription';

export function fromElement(element: HTMLElement, eventName: string): Observable<Event> {
    return new Observable<Event>((observer: SafeObserver<Event>): Subscription => {
        function handle(event: Event): void {
            observer.next(event);
        }

        element.addEventListener(eventName, handle);

        return {
            unsubscribe(): void {
                element.removeEventListener(eventName, handle);
            },
        };
    });
}
