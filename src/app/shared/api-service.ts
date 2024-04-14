export class ApiService {
    static readonly socket = new WebSocket('ws://localhost:4000/');

    static readonly send = <T>(e: T) => {
        return e;
    };

    static readonly open = () => {
        this.socket.onopen = event => {
            console.log(event, event.type);
        };
    };

    static readonly message = () => {
        this.socket.onmessage = event => {
            console.log(event, event.type);
        };
    };

    static readonly error = () => {
        this.socket.onerror = event => {
            console.log(event, event.type);
        };
    };
    static readonly close = () => {
        this.socket.onclose = event => {
            console.log(event, event.type);
        };
    };

    static readonly socketRun = () => {
        Object.getOwnPropertyNames(ApiService).forEach(prop => {
            const propName = prop as keyof typeof ApiService;

            if (typeof ApiService[propName] === 'function' && propName !== 'socketRun' && propName !== 'send') {
                (ApiService[propName] as Function)();
            }
        });
    };
}
