export interface MapFunction<T, K> {
    (input: T): K;
}
