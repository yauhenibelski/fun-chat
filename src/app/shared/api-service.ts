import { ChatDto } from '@interfaces/dto';
import { RequestType } from '../types/request.type';
import { userLoginResponse$, userLogoutResponse$ } from './observables';

export class ApiService {
    static readonly socket = new WebSocket('ws://localhost:4000/');

    static readonly send = <Payload>(type: RequestType, payload: Payload): void => {
        const body: ChatDto<Payload> = {
            id: '',
            type,
            payload,
        };

        this.socket.send(JSON.stringify(body));
    };

    static readonly open = () => {
        this.socket.onopen = event => {
            console.log(event.type);
        };
    };

    static readonly message = () => {
        this.socket.onmessage = ({ data }) => {
            const dataDto = JSON.parse(data);

            switch (dataDto.type) {
                case 'USER_LOGIN': {
                    userLoginResponse$.publish(dataDto.payload);
                    break;
                }
                case 'USER_LOGOUT': {
                    userLogoutResponse$.publish(dataDto.payload);
                    break;
                }
                // case 'USER_EXTERNAL_LOGIN': console.log(1);
                // case 'USER_EXTERNAL_LOGOUT': console.log(1);
                // case 'USER_ACTIVE': console.log(1);
                // case 'USER_INACTIVE': console.log(1);
                // case 'MSG_SEND': console.log(1);
                // case 'MSG_READ': console.log(1);
                // case 'MSG_DELIVER': console.log(1);
                // case 'MSG_FROM_USER': console.log(1);
                // case 'MSG_EDIT': console.log(1);
                // case 'MSG_DELETE': console.log(1);
                case 'ERROR': {
                    console.log(dataDto, 'error');
                    break;
                }
                default:
                    break;
            }
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
