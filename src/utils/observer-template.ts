/* eslint-disable no-empty-function */
/* eslint-disable no-underscore-dangle */
type Subscriber<T> = (data: T) => void;

export class Observable<T> {
    constructor(protected _value: T) {}
    private observers: Subscriber<T>[] = [];

    get value() {
        return this._value;
    }

    public subscribe(subscriber: Subscriber<T>): void {
        subscriber(this.value);
        this.observers.push(subscriber);
    }

    public unsubscribe(subscriber: Subscriber<T>): void {
        const index = this.observers.indexOf(subscriber);
        if (index !== -1) this.observers.splice(index, 1);
    }

    public publish(data: T): void {
        this._value = data;
        this.observers.forEach(callback => {
            callback(data);
        });
    }
}

export default Observable;
