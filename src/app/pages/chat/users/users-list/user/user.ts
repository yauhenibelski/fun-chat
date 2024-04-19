import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import { UserAuthPropRes, UserAuthRes } from '@interfaces/user-authentication-response';
import createElement from '@utils/create-element';
import {
    currentExternalUser$,
    externalUserMsgHistory$,
    msgDeleteResponse$,
    msgSendResponse$,
    userExternalLoginResponse$,
    userExternalLogoutResponse$,
} from '@shared/observables';
import { MessagesRes, SendMessageRes } from '@interfaces/send-message-response';
import { getID } from '@utils/get-id';
import { ChatDto } from '@interfaces/dto';
import { ApiService } from '@shared/api-service';
import style from './user.module.scss';
import { UserLogin } from '../../../../../types/user-login';
import { MessageInteraction } from '../../../../../types/message-interaction';

@CustomSelector('User')
class User extends Component {
    private requestID = getID();
    private newMessageID: string[] = [];
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

    resetUnreadMessageCount(): void {
        if (!this.newMessageID.length) return;

        this.newMessageID = [];
        this.render();
    }

    private externalUserMsgHistorySubscribe = (data: ChatDto<MessagesRes> | null): void => {
        if (!data) return;

        const {
            id: responseID,
            payload: { messages },
        } = data;

        if (responseID !== this.requestID) return;

        this.newMessageID = [];

        messages.forEach(mgs => {
            if (mgs.from === this.user.login && !mgs.status.isReaded) this.newMessageID.push(mgs.id);
        });

        this.render();
    };

    private msgSendResponseSubscribe = (mgs: SendMessageRes | null): void => {
        if (!mgs) return;

        const { from: fromUserLogin, id } = mgs.message;

        if (fromUserLogin === this.user.login) {
            this.newMessageID.push(id);
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

    protected msgDeleteResponseSubscribe = (data: MessageInteraction<'isDeleted'> | null) => {
        if (!data) return;
        const IDindex = this.newMessageID.indexOf(data.message.id);

        if (IDindex !== -1) {
            this.newMessageID.splice(IDindex, 1);
            this.render();
        }
    };

    protected connectedCallback(): void {
        userExternalLoginResponse$.subscribe(this.updateUserSubscribe);
        userExternalLogoutResponse$.subscribe(this.updateUserSubscribe);
        msgSendResponse$.subscribe(this.msgSendResponseSubscribe);
        externalUserMsgHistory$.subscribe(this.externalUserMsgHistorySubscribe);
        msgDeleteResponse$.subscribe(this.msgDeleteResponseSubscribe);
    }

    protected disconnectedCallback(): void {
        userExternalLoginResponse$.unsubscribe(this.updateUserSubscribe);
        userExternalLogoutResponse$.unsubscribe(this.updateUserSubscribe);
        msgSendResponse$.unsubscribe(this.msgSendResponseSubscribe);
        externalUserMsgHistory$.unsubscribe(this.externalUserMsgHistorySubscribe);
        msgDeleteResponse$.unsubscribe(this.msgDeleteResponseSubscribe);
    }

    protected createComponent(): void {
        this.onclick = () => currentExternalUser$.publish(this);

        this.appendElements();
    }

    protected childrenElements() {
        return {
            unreadMessage: createElement({ tag: 'span', style: style.unread, text: `${this.newMessageID.length}` }),
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

        if (this.newMessageID.length) this.contentWrap.append(unreadMessage);
    }
}

export default User;
