import { Observable } from '@apestaartje/observable/observable/Observable';
import { timer } from '@apestaartje/observable/observable/timer/timer';

type NextableObserver<T> = { next(v: T): void };

describe('timer', (): void => {
    const observer: NextableObserver<number> = {
        next(v: number): void {
            // nothing
        },
    };

    it('will emit for a given time values each number of miliseconds', (done: Function): void => {
        const nextSpy: jasmine.Spy = spyOn(observer, 'next');
        const t: Observable<number> = timer(10, 200);

        t.subscribe(observer);

        setTimeout(
            (): void => {
                expect(nextSpy).toHaveBeenCalledTimes(10);
                done();
            },
            2500,
        );
    });
});
