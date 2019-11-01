import { DataSource } from '../DataSource';
import { DataSourceOptions } from '../DataSourceOptions';

/**
 * Emit values over a period of time
 */

export class Timer extends DataSource<number> {
    private _counter: number = 0;
    private readonly _interval: number;
    private readonly _repeat: number;

    constructor(options: DataSourceOptions<number>, repeat: number, delay: number = 1000) {
        super(options);

        this._repeat = repeat;
        this._interval = window.setInterval(
            (): void => {
                this._counter += 1;

                this.emit(this._counter);
            },
            delay,
        );
    }

    public destroy(): void {
        window.clearInterval(this._interval);
    }

    protected emit(value: number): void {
        if (this._onData !== undefined) {
            this._onData(value);
        }

        if (this._repeat === value) {
            if (this._onComplete !== undefined) {
                this._onComplete();
            }

            this.destroy();
        }
    }
}
