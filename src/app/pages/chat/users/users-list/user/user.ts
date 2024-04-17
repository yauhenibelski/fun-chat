import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import { UserAuthPropRes, UserAuthRes } from '@interfaces/user-authentication-response';
import createElement from '@utils/create-element';
import {
    currentExternalUser$,
    externalUserMsgHistory$,
    msgSendResponse$,
    userExternalLoginResponse$,
    userExternalLogoutResponse$,
} from '@shared/observables';
import { MessagesRes, SendMessageRes } from '@interfaces/send-message-response';
import SessionStorage from '@shared/session-storage/session-storage';
import { getID } from '@utils/get-id';
import { ChatDto } from '@interfaces/dto';
import { ApiService } from '@shared/api-service';
import style from './user.module.scss';
import { UserLogin } from '../../../../../types/user-login';

@CustomSelector('User')
class User extends Component {
    private requestID = getID();
    public unreadMessageCount = 0;
    protected elements = this.childrenElements();

    constructor(public user: UserAuthPropRes) {
        super(style);

        this.createComponent();

        ApiService.send<UserLogin>(
            'MSG_FROM_USER',
            {
                user: {
                    login: this.user.login,
                },
            },
            this.requestID,
        );
    }

    private externalUserMsgHistorySubscribe = (data: ChatDto<MessagesRes> | null): void => {
        if (!data) return;

        const {
            id: responseID,
            payload: { messages },
        } = data;

        if (responseID !== this.requestID) return;

        this.unreadMessageCount = 0;

        messages.forEach(mgs => {
            if (mgs.from === this.user.login && !mgs.status.isReaded) this.unreadMessageCount += 1;
        });

        this.render();
    };

    private msgSendResponseSubscribe = (mgs: SendMessageRes | null): void => {
        if (!mgs) return;

        const currentExternalUserLogin = currentExternalUser$.value?.user.login;
        const { from: fromUserLogin } = mgs.message;

        const isSelectedUserDialogWindow =
            fromUserLogin === SessionStorage.getUserName() || currentExternalUserLogin === fromUserLogin;

        if (!isSelectedUserDialogWindow && fromUserLogin === this.user.login) {
            this.unreadMessageCount += 1;
            this.render();
        }
    };

    protected updateUserSubscribe = (data: UserAuthRes | null) => {
        if (!data) return;

        if (data.user.login === this.user.login) {
            this.user = data.user;
            this.render();
        }
    };

    protected connectedCallback(): void {
        userExternalLoginResponse$.subscribe(this.updateUserSubscribe);
        userExternalLogoutResponse$.subscribe(this.updateUserSubscribe);
        msgSendResponse$.subscribe(this.msgSendResponseSubscribe);
        externalUserMsgHistory$.subscribe(this.externalUserMsgHistorySubscribe);
    }

    protected disconnectedCallback(): void {
        userExternalLoginResponse$.unsubscribe(this.updateUserSubscribe);
        userExternalLogoutResponse$.unsubscribe(this.updateUserSubscribe);
        msgSendResponse$.unsubscribe(this.msgSendResponseSubscribe);
        externalUserMsgHistory$.unsubscribe(this.externalUserMsgHistorySubscribe);
    }

    protected createComponent(): void {
        this.onclick = () => currentExternalUser$.publish(this);

        this.appendElements();
    }

    protected childrenElements() {
        return {
            unreadMessage: createElement({ tag: 'span', style: style.unread, text: `${this.unreadMessageCount}` }),
            userName: createElement({ tag: 'p', text: this.user.login }),
            userWrap: createElement({
                tag: 'div',
                style: [style.user, this.user.isLogined ? style.active : ''],
            }),
        };
    }

    protected appendElements(): void {
        const { userName, userWrap, unreadMessage } = this.elements;

        userWrap.append(userName);

        this.contentWrap.append(userWrap);

        if (this.unreadMessageCount) this.contentWrap.append(unreadMessage);
    }
}

export default User;
