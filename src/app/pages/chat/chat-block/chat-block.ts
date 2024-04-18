import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import {
    currentExternalUser$,
    externalUserMsgHistory$,
    msgDeliverResponse$,
    msgReadResponse$,
    msgSendResponse$,
} from '@shared/observables';
import { ApiService } from '@shared/api-service';
import { SendMessageRes, MessagesRes, SendMessageResProp, MessageStatus } from '@interfaces/send-message-response';
import { SendMessageReq } from '@interfaces/send-message-request';
import SessionStorage from '@shared/session-storage/session-storage';
import { ChatDto } from '@interfaces/dto';
import { getID } from '@utils/get-id';
import { MessageChangeStatus } from '@interfaces/message-interaction';
import style from './chat-block.module.scss';
import type User from '../users/users-list/user/user';
import { UserLogin } from '../../../types/user-login';
import Message from './message/message';
import { MessageStatusRes } from '../../../types/message-delivery-status';
import MessageSeparator from './message/new-message-separator/new-message-separator';

@CustomSelector('Chat-block')
class ChatBlock extends Component {
    protected elements = this.childrenElements();
    private messages: { [key: string]: Message } = {};
    private newMessages: { [key: string]: Message } = {};
    private lastMessageElem: HTMLElement | null = null;
    private newMessageSeparator = new MessageSeparator();
    private requestID = getID();

    constructor() {
        super(style);

        this.createComponent();

        currentExternalUser$.subscribe(this.currentExternalUserSubscribe);
        externalUserMsgHistory$.subscribe(this.externalUserMsgHistorySubscribe);
        msgSendResponse$.subscribe(this.msgSendResponseSubscribe);
        msgDeliverResponse$.subscribe(this.msgStatusResponseSubscribe('isDelivered'));
        msgReadResponse$.subscribe(this.msgStatusResponseSubscribe('isReaded'));
    }

    private setReadMessageStatus(): void {
        if (!Object.values(this.newMessages).length) return;

        Object.values(this.newMessages).forEach(({ message }) => {
            ApiService.send<MessageChangeStatus>('MSG_READ', {
                message: {
                    id: message.id,
                },
            });
        });
    }

    private msgStatusResponseSubscribe = <Status extends keyof MessageStatus>(statusType: Status) => {
        return (mgs: MessageStatusRes<Status> | null): void => {
            if (!mgs) return;
            const hasMessageInMessages = mgs.message.id in this.messages;

            if (!hasMessageInMessages) return;

            const { message } = mgs;
            const isMessageForUser = this.messages[message.id].message.to === SessionStorage.getUserName();

            this.messages[message.id].updateMessage(message.status[statusType], statusType);

            if (statusType === 'isReaded' && isMessageForUser) {
                delete this.newMessages[mgs.message.id];
                currentExternalUser$.value?.resetUnreadMessageCount();
                this.removeMessageSeparator();
            }
        };
    };

    private msgSendResponseSubscribe = (mgs: SendMessageRes | null): void => {
        if (!currentExternalUser$.value) return;
        if (!mgs) return;

        const { login: currentExternalUserLogin } = currentExternalUser$.value.user;
        const { from: fromUserLogin } = mgs.message;

        const isSelectedUserDialogWindow =
            fromUserLogin === SessionStorage.getUserName() || currentExternalUserLogin === fromUserLogin;

        if (isSelectedUserDialogWindow) {
            const { dialogWindow, dialogWindowWrap } = this.elements;
            const isEmptyDialogWindow = !Object.keys(this.messages).length && !Object.keys(this.newMessages).length;
            const isOwnMessage = fromUserLogin === SessionStorage.getUserName();

            if (isEmptyDialogWindow) {
                dialogWindowWrap.classList.remove(style['empty-dialog']);
                dialogWindow.innerHTML = '';
            }

            this.saveMessage(mgs.message);

            if (isOwnMessage) this.scrollToElem('last_message');
            if (!isOwnMessage) this.scrollToElem('message_separator');
            if (this.hasUnreadMessage()) this.addScrollEvent();
        }
    };

    private externalUserMsgHistorySubscribe = (data: ChatDto<MessagesRes> | null): void => {
        if (!data) return;

        const { dialogWindow, dialogWindowWrap } = this.elements;
        const {
            id: responseID,
            payload: { messages },
        } = data;

        if (responseID !== this.requestID) return;

        this.messages = {};
        this.newMessages = {};

        if (!messages.length) {
            dialogWindowWrap.classList.add(style['empty-dialog']);
            dialogWindow.innerText = 'Write your first message...';
            return;
        }

        dialogWindowWrap.classList.remove(style['empty-dialog']);
        dialogWindow.innerHTML = '';

        messages.forEach(message => this.saveMessage(message));

        if (this.hasUnreadMessage()) {
            this.scrollToElem('message_separator');
            this.addScrollEvent();

            return;
        }

        this.scrollToElem('last_message');
    };

    private currentExternalUserSubscribe = (currentUser: User | null): void => {
        if (!currentUser) return;

        const { externalUserName, externalUserStatus, inputTextWrap, submitTextBtn } = this.elements;
        const textField = <HTMLInputElement>inputTextWrap.firstChild;

        textField.disabled = false;
        submitTextBtn.disabled = false;

        externalUserName.innerText = currentUser.user.login;
        externalUserStatus.innerText = currentUser.user.isLogined ? 'online' : 'offline';

        ApiService.send<UserLogin>(
            'MSG_FROM_USER',
            {
                user: {
                    login: currentUser.user.login,
                },
            },
            this.requestID,
        );
    };

    protected createComponent(): void {
        const { inputTextWrap, textForm, submitTextBtn, dialogWindowWrap } = this.elements;

        const textField = <HTMLInputElement>inputTextWrap.firstChild;
        textField.placeholder = 'message...';
        textField.disabled = true;

        submitTextBtn.disabled = true;

        dialogWindowWrap.onclick = () => this.setReadMessageStatus();

        textForm.onsubmit = (event: Event) => {
            event.preventDefault();
            if (!textField.value) return;

            ApiService.send<SendMessageReq>('MSG_SEND', {
                message: {
                    text: textField.value,
                    to: currentExternalUser$.value!.user.login,
                },
            });
            textField.value = '';

            this.setReadMessageStatus();
        };

        this.appendElements();
    }

    protected saveMessage(message: SendMessageResProp): void {
        const { dialogWindow } = this.elements;
        const newMessage = new Message(message);
        const isUnReadMessageFromExternalUser =
            !message.status.isReaded && SessionStorage.getUserName() !== message.from;

        if (isUnReadMessageFromExternalUser) {
            this.newMessages[message.id] = newMessage;
        }

        if (!this.newMessageSeparator.isShow && isUnReadMessageFromExternalUser) {
            dialogWindow.append(this.newMessageSeparator.getElement());
        }

        this.messages[message.id] = newMessage;

        dialogWindow.append(newMessage.getElement());

        this.lastMessageElem = newMessage.getElement();
    }

    protected scrollToElem(value: 'last_message' | 'message_separator'): void {
        if (value === 'message_separator') this.newMessageSeparator.getElement().scrollIntoView(true);
        if (value === 'last_message' && this.lastMessageElem) this.lastMessageElem!.scrollIntoView(false);
    }

    protected removeMessageSeparator(): void {
        if (!this.newMessageSeparator.isShow) return;

        this.newMessageSeparator.getElement().remove();
    }

    protected hasUnreadMessage(): boolean {
        return Boolean(Object.keys(this.newMessages).length);
    }

    protected addScrollEvent(): void {
        const { dialogWindow } = this.elements;
        setTimeout(() => {
            dialogWindow.onscroll = () => {
                this.setReadMessageStatus();
                dialogWindow.onscroll = null;
            };
        });
    }

    protected childrenElements() {
        const dialogWindowWrap = createElement(
            {
                tag: 'div',
                style: [style['dialog-window'], style['empty-dialog']],
                html: 'Select a user to start chatting',
            },
            true,
        );
        return {
            externalUserWrap: createElement({ tag: 'div', style: style['external-user-wrap'] }),
            externalUserName: createElement({ tag: 'p' }),
            externalUserStatus: createElement({ tag: 'p', style: style.status }),
            textForm: createElement({ tag: 'form', style: style['text-form'] }),
            inputTextWrap: createElement({ tag: 'input', style: style['input-text-wrap'] }, true),
            submitTextBtn: createElement({ tag: 'button', text: 'Send' }),
            dialogWindow: <HTMLDivElement>dialogWindowWrap.firstElementChild,
            dialogWindowWrap,
        };
    }

    protected appendElements(): void {
        const {
            externalUserName,
            externalUserStatus,
            externalUserWrap,
            inputTextWrap,
            textForm,
            submitTextBtn,
            dialogWindowWrap,
        } = this.elements;

        textForm.append(inputTextWrap, submitTextBtn);
        externalUserWrap.append(externalUserName, externalUserStatus);

        this.contentWrap.append(externalUserWrap, dialogWindowWrap, textForm);
    }
}

export default ChatBlock;
