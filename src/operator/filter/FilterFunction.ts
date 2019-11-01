export interface FilterFunction<T> {
    (input: T): boolean;
}
