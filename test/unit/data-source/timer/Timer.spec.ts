import { DataSourceOptions } from '@apestaartje/observable/data-source/DataSourceOptions';
import { Timer } from '@apestaartje/observable/data-source/timer/Timer';

describe('Timer', (): void => {
    it('emits a given amount of values', (done: Function): void => {
        const options: DataSourceOptions<number> = {
            onData(value: number): void {
                // nothing
            },
            onComplete(): void {
                // nothing
            },
        };

        const onDataSpy: jasmine.Spy = spyOn(options, 'onData').and.callThrough();
        const onCompleteSpy: jasmine.Spy = spyOn(options, 'onComplete').and.callThrough();

        const t: Timer = new Timer(
            options,
            10,
            10,
        );

        window.setTimeout(
            (): void => {
                expect(onDataSpy).toHaveBeenCalledTimes(10);
                expect(onCompleteSpy).toHaveBeenCalled();

                done();
            },
            150,
        );

    });

    describe('destroy', (): void => {
        it('stops the source from emitting new values', (done: Function): void => {
            const options: DataSourceOptions<number> = {
                onData(value: number): void {
                    // nothing
                },
                onComplete(): void {
                    // nothing
                },
            };

            const onDataSpy: jasmine.Spy = spyOn(options, 'onData').and.callThrough();
            const onCompleteSpy: jasmine.Spy = spyOn(options, 'onComplete').and.callThrough();

            const t: Timer = new Timer(
                options,
                100,
                100,
            );

            window.setTimeout(
                (): void => {
                    expect(onDataSpy).toHaveBeenCalledTimes(2);
                    expect(onCompleteSpy).not.toHaveBeenCalled();

                    done();
                },
                250,
            );
        });
    });
});
