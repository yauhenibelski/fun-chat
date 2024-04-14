import { ChatDto } from '@interfaces/dto';
import { UserAuthReq } from '@interfaces/user-authentication-request';
import { RequestType } from '../types/request.type';
import {
    activeUsersResponse$,
    inActiveUsersResponse$,
    userExternalLoginResponse$,
    userExternalLogoutResponse$,
    userLoginResponse$,
    userLogoutResponse$,
} from './observables';
import SessionStorage from './session-storage/session-storage';

export class ApiService {
    static readonly socket = new WebSocket('ws://localhost:4000/');

    static readonly send = <Payload>(type: RequestType, data: Payload): void => {
        const body: ChatDto<Payload> = {
            id: '',
            type,
            payload: data,
        };

        this.socket.send(JSON.stringify(body));
    };

    static readonly open = () => {
        this.socket.onopen = event => {
            console.log(event.type);

            if (SessionStorage.isLogined()) {
                ApiService.login();
            }
        };
    };

    static readonly message = () => {
        this.socket.onmessage = event => {
            const dataDto = JSON.parse(event.data);

            if (dataDto.type === 'USER_LOGIN') userLoginResponse$.publish(dataDto.payload);
            if (dataDto.type === 'USER_LOGOUT') userLogoutResponse$.publish(dataDto.payload);
            if (dataDto.type === 'USER_ACTIVE') activeUsersResponse$.publish(dataDto.payload.users);
            if (dataDto.type === 'USER_INACTIVE') inActiveUsersResponse$.publish(dataDto.payload.users);
            if (dataDto.type === 'USER_EXTERNAL_LOGIN') userExternalLoginResponse$.publish(dataDto.payload);
            if (dataDto.type === 'USER_EXTERNAL_LOGOUT') userExternalLogoutResponse$.publish(dataDto.payload);

            // case 'MSG_SEND': console.log(1);
            // case 'MSG_READ': console.log(1);
            // case 'MSG_DELIVER': console.log(1);
            // case 'MSG_FROM_USER': console.log(1);
            // case 'MSG_EDIT': console.log(1);
            // case 'MSG_DELETE': console.log(1);

            if (dataDto.type === 'ERROR') console.log(dataDto, 'error');

            console.log(event);
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

    static readonly fetchUsers = (): void => {
        ApiService.send('USER_ACTIVE', null);
        ApiService.send('USER_INACTIVE', null);
    };

    static readonly logout = (): void => {
        ApiService.send<UserAuthReq>('USER_LOGOUT', {
            user: {
                login: SessionStorage.app.login,
                password: SessionStorage.storage.getItem('password')!, // ??????
            },
        });
    };

    static readonly login = (login?: string, password?: string): void => {
        if (login && password) {
            ApiService.send<UserAuthReq>('USER_LOGIN', {
                user: {
                    login,
                    password,
                },
            });
            SessionStorage.storage.setItem('password', password); // ??????
            return;
        }

        ApiService.send<UserAuthReq>('USER_LOGIN', {
            user: {
                login: SessionStorage.app.login,
                password: SessionStorage.storage.getItem('password')!, // ??????
            },
        });
    };

    static readonly socketRun = () => {
        ApiService.open();
        ApiService.message();
        ApiService.close();
        ApiService.error();
    };
}
