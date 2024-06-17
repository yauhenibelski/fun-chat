type Subscriber<T> = (data: T) => void;

export class Observable<T> {
    constructor(protected currentValue: T) {}
    private observers: Subscriber<T>[] = [];

    get value() {
        return this.currentValue;
    }

    public subscribe(subscriber: Subscriber<T>): void {
        this.observers.push(subscriber);
    }

    public unsubscribe(subscriber: Subscriber<T>): void {
        const index = this.observers.indexOf(subscriber);
        if (index !== -1) this.observers.splice(index, 1);
    }

    public publish(data: T): void {
        this.currentValue = data;
        this.observers.forEach(callback => {
            callback(data);
        });
    }
}

export default Observable;
