import { ChatDto } from '@interfaces/dto';
import { UserAuthReq } from '@interfaces/user-authentication-request';
import ErrorMessage from '@shared/error-message/error-message';
import { RequestType } from '../../types/request.type';
import {
    activeUsersResponse$,
    editedMessageResponse$,
    externalUserMsgHistory$,
    inActiveUsersResponse$,
    msgDeleteResponse$,
    msgDeliverResponse$,
    msgReadResponse$,
    msgSendResponse$,
    showLoader$,
    userExternalLoginResponse$,
    userExternalLogoutResponse$,
    userLoginResponse$,
    userLogoutResponse$,
} from '../observables';
import SessionStorage from '../session-storage/session-storage';
import { SocketState } from './socket-state.const';
import { Popup } from '../../core/popup/popup';

export class ApiService {
    static socket: WebSocket = this.getSocket();
    static intervalID?: number | undefined;

    static readonly send = <Payload>(type: RequestType, data: Payload, id?: string): void => {
        const body: ChatDto<Payload> = {
            id: id || '',
            type,
            payload: data,
        };

        this.socket.send(JSON.stringify(body));
    };

    private static getSocket(): WebSocket {
        return new WebSocket('ws://localhost:4000');
    }

    static readonly open = (): void => {
        this.socket.onopen = () => {
            if (SessionStorage.isLogined()) {
                ApiService.login();
            }
            showLoader$.publish(false);
        };
    };

    static readonly message = (): void => {
        this.socket.onmessage = event => {
            const dataDto = JSON.parse(event.data);

            if (dataDto.type === 'USER_LOGIN') userLoginResponse$.publish(dataDto.payload);
            if (dataDto.type === 'USER_LOGOUT') userLogoutResponse$.publish(dataDto.payload);
            if (dataDto.type === 'USER_ACTIVE') activeUsersResponse$.publish(dataDto.payload.users);
            if (dataDto.type === 'USER_INACTIVE') inActiveUsersResponse$.publish(dataDto.payload.users);
            if (dataDto.type === 'USER_EXTERNAL_LOGIN') userExternalLoginResponse$.publish(dataDto.payload);
            if (dataDto.type === 'USER_EXTERNAL_LOGOUT') userExternalLogoutResponse$.publish(dataDto.payload);
            if (dataDto.type === 'MSG_FROM_USER') externalUserMsgHistory$.publish(dataDto);
            if (dataDto.type === 'MSG_SEND') msgSendResponse$.publish(dataDto.payload);
            if (dataDto.type === 'MSG_DELIVER') msgDeliverResponse$.publish(dataDto.payload);
            if (dataDto.type === 'MSG_READ') msgReadResponse$.publish(dataDto.payload);
            if (dataDto.type === 'MSG_DELETE') msgDeleteResponse$.publish(dataDto.payload);
            if (dataDto.type === 'MSG_EDIT') editedMessageResponse$.publish(dataDto.payload);
            if (dataDto.type === 'ERROR') Popup.show(new ErrorMessage(dataDto.payload.error).getElement());
        };
    };

    static readonly error = (): void => {
        this.socket.onerror = () => {
            this.connect();
        };
    };

    static readonly close = (): void => {
        this.socket.onclose = () => {
            Popup.show(new ErrorMessage(`connection failed`).getElement());
            this.connect();
        };
    };

    static readonly connect = (): void => {
        if (this.intervalID) return;

        this.intervalID = setInterval(() => {
            if (this.socket.readyState === SocketState.CONNECTING) return;
            if (this.socket.readyState === SocketState.OPEN) location.reload();

            this.socket = this.getSocket();
        }, 1000) as unknown as number;

        showLoader$.publish(true);
    };

    static readonly fetchUsers = (): void => {
        ApiService.send('USER_ACTIVE', null);
        ApiService.send('USER_INACTIVE', null);
    };

    static readonly logout = (): void => {
        ApiService.send<UserAuthReq>('USER_LOGOUT', {
            user: {
                login: SessionStorage.app.login,
                password: SessionStorage.storage.getItem('password')!,
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
            SessionStorage.storage.setItem('password', password);
            return;
        }

        ApiService.send<UserAuthReq>('USER_LOGIN', {
            user: {
                login: SessionStorage.app.login,
                password: SessionStorage.storage.getItem('password')!,
            },
        });

        showLoader$.publish(true);
    };

    static readonly socketRun = (): void => {
        ApiService.open();
        ApiService.message();
        ApiService.close();
        ApiService.error();
    };
}
