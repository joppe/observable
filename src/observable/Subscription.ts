
/**
 * A subscription is returned when an observer subscribes to an observable. And a subscription is returned
 * by the subscriber when connecting the (Safe)Observer to the data source.
 */
export interface Subscription {
    unsubscribe(): void;
}
