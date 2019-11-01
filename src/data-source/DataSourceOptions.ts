export interface DataSourceOptions<T> {
    onData(value: T): void;
    onComplete(): void;
}
