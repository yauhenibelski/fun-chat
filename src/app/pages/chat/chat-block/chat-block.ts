import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import {
    currentExternalUser$,
    editedMessage$,
    editedMessageResponse$,
    externalUserMsgHistory$,
    msgDeleteResponse$,
    msgDeliverResponse$,
    msgReadResponse$,
    msgSendResponse$,
    userExternalLoginResponse$,
    userExternalLogoutResponse$,
} from '@shared/observables';
import { ApiService } from '@shared/api-service';
import { SendMessageRes, MessagesRes, SendMessageResProp, MessageStatus } from '@interfaces/send-message-response';
import { ChangeStatusMessageReq, SendMessageReq } from '@interfaces/send-message-request';
import SessionStorage from '@shared/session-storage/session-storage';
import { ChatDto } from '@interfaces/dto';
import { getID } from '@utils/get-id';
import { MessageChangeStatus } from '@interfaces/message-interaction';
import { UserAuthRes } from '@interfaces/user-authentication-response';
import style from './chat-block.module.scss';
import type User from '../users-block/users-list/user/user';
import { UserLogin } from '../../../types/user-login';
import Message from './message/message';
import { MessageStatusRes } from '../../../types/message-delivery-status';
import MessageSeparator from './new-message-separator/new-message-separator';
import { MessageInteraction } from '../../../types/message-interaction';

@CustomSelector('Chat-block')
class ChatBlock extends Component {
    protected elements = this.childrenElements();
    private messages: { [key: string]: Message } = {};
    private newMessages: { [key: string]: Message } = {};
    private lastMessageElem: HTMLElement | null = null;
    private newMessageSeparator = new MessageSeparator();
    private requestID = getID();
    private externalUserNameCache = '';

    constructor() {
        super(style);

        this.createComponent();

        currentExternalUser$.subscribe(this.updateCurrentExternalUser);
        externalUserMsgHistory$.subscribe(this.handleExternalUserMsgHistoryResponse);
        msgSendResponse$.subscribe(this.handleSendMassageResponse);
        msgDeliverResponse$.subscribe(this.handleMessageStatusResponse('isDelivered'));
        msgReadResponse$.subscribe(this.handleMessageStatusResponse('isReaded'));
        editedMessageResponse$.subscribe(this.handleMessageStatusResponse('isEdited'));
        msgDeleteResponse$.subscribe(this.handleDeleteMessageResponse);
        editedMessage$.subscribe(this.setTextFieldFocus);
        userExternalLoginResponse$.subscribe(this.handleExternalUserLoginOrLogoutResponse);
        userExternalLogoutResponse$.subscribe(this.handleExternalUserLoginOrLogoutResponse);
    }

    private handleExternalUserLoginOrLogoutResponse = (data: UserAuthRes | null): void => {
        if (!data) return;
        if (!currentExternalUser$.value) return;

        const { login, isLogined } = data.user;
        const { login: currentUserLogin } = currentExternalUser$.value.user;
        const { color, status } = this.getColorStatus(isLogined);
        const { externalUserStatus } = this.elements;

        if (login === currentUserLogin) {
            externalUserStatus.innerText = status;
            externalUserStatus.style.color = color;
        }
    };

    private setTextFieldFocus = (mgs: Message | null): void => {
        if (!mgs) return;

        const { message } = mgs;
        if (message.id in this.messages) {
            const { inputTextWrap } = this.elements;
            const textField = <HTMLInputElement>inputTextWrap.firstChild;

            textField.value = message.text;
            textField.focus();
        }
    };

    private handleDeleteMessageResponse = (mgs: MessageInteraction<'isDeleted'> | null): void => {
        if (!mgs) return;

        const { id } = mgs.message;

        if (!this.messages[id]) return;

        this.messages[id].getElement().remove();
        delete this.messages[id];

        if (this.newMessages[id]) delete this.newMessages[id];
        if (this.newMessageSeparator.isShow && !this.hasUnreadMessage()) this.removeMessageSeparator();
    };

    private setReadMessageStatus(): void {
        if (!this.hasUnreadMessage()) return;

        Object.values(this.newMessages).forEach(({ message }) => {
            ApiService.send<MessageChangeStatus>('MSG_READ', {
                message: {
                    id: message.id,
                },
            });
        });
    }

    private handleMessageStatusResponse = <Status extends keyof MessageStatus>(statusType: Status) => {
        return (mgs: MessageStatusRes<Status> | null): void => {
            if (!mgs) return;

            const hasMessageInMessages = mgs.message.id in this.messages;

            if (!hasMessageInMessages) return;

            const { message } = mgs;
            const isMessageForUser = this.messages[message.id].message.to === SessionStorage.getUserName();

            if (statusType === 'isEdited') {
                const currentMessage = this.messages[message.id];
                const { message: editedMessage } = currentMessage;

                editedMessage.text = message.text;

                editedMessage$.publish(null);
            }

            if (statusType === 'isReaded' && isMessageForUser) {
                delete this.newMessages[mgs.message.id];
                currentExternalUser$.value?.resetUnreadMessageCount();
                this.removeMessageSeparator();
            }

            this.messages[message.id].updateMessage(message.status[statusType], statusType);
        };
    };

    private handleSendMassageResponse = (mgs: SendMessageRes | null): void => {
        if (!currentExternalUser$.value) return;
        if (!mgs) return;
        const { login: currentExternalUserLogin } = currentExternalUser$.value.user;
        const { from: fromUserLogin } = mgs.message;
        const { dialogWindow, dialogWindowWrap } = this.elements;

        const isSelectedUserDialogWindow =
            fromUserLogin === SessionStorage.getUserName() || currentExternalUserLogin === fromUserLogin;

        if (isSelectedUserDialogWindow) {
            const isEmptyDialogWindow = !Object.keys(this.messages).length && !Object.keys(this.newMessages).length;
            const isOwnMessage = fromUserLogin === SessionStorage.getUserName();

            if (isEmptyDialogWindow) {
                dialogWindowWrap.classList.remove(style['empty-dialog']);
                dialogWindow.innerHTML = '';
            }

            this.saveMessage(mgs.message);

            if (isOwnMessage) this.scrollToElem('last_message');
            if (!isOwnMessage) this.scrollToElem('message_separator');
        }
    };

    private handleExternalUserMsgHistoryResponse = (data: ChatDto<MessagesRes> | null): void => {
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

            return;
        }

        this.scrollToElem('last_message');
    };

    private updateCurrentExternalUser = (currentUser: User | null): void => {
        if (!currentUser) return;

        const { isLogined, login } = currentUser.user;
        const isSelectedUser = this.externalUserNameCache === login;

        if (isSelectedUser) return;

        const { externalUserName, externalUserStatus, inputTextWrap, submitTextBtn } = this.elements;
        const textField = <HTMLInputElement>inputTextWrap.firstChild;
        const { color, status } = this.getColorStatus(isLogined);

        textField.value = '';
        textField.disabled = false;

        submitTextBtn.disabled = false;

        externalUserName.innerText = login;

        externalUserStatus.innerText = status;
        externalUserStatus.style.color = color;

        ApiService.send<UserLogin>(
            'MSG_FROM_USER',
            {
                user: {
                    login,
                },
            },
            this.requestID,
        );

        this.externalUserNameCache = login;
    };

    private getColorStatus(isLogined: boolean) {
        return {
            status: isLogined ? 'online' : 'offline',
            color: isLogined ? 'green' : 'red',
        };
    }

    protected createComponent(): void {
        const { inputTextWrap, textForm, submitTextBtn, dialogWindowWrap } = this.elements;

        const textField = <HTMLInputElement>inputTextWrap.firstChild;
        textField.placeholder = 'message...';
        textField.disabled = true;

        submitTextBtn.disabled = true;

        dialogWindowWrap.onclick = () => this.setReadMessageStatus();
        dialogWindowWrap.onwheel = () => this.setReadMessageStatus();

        textForm.onsubmit = this.sendOrEditMassage;

        this.appendElements();
    }

    protected sendOrEditMassage = (event: Event): void => {
        event.preventDefault();
        this.setReadMessageStatus();

        const { inputTextWrap } = this.elements;
        const textField = <HTMLInputElement>inputTextWrap.firstChild;
        const isEditMassage = Boolean(editedMessage$.value);
        const massageHasOnlyGaps = textField.value.split('').every(symbol => symbol === ' ');

        if (!textField.value || massageHasOnlyGaps) return;

        if (isEditMassage) {
            ApiService.send<ChangeStatusMessageReq>('MSG_EDIT', {
                message: {
                    id: editedMessage$.value!.message.id,
                    text: textField.value,
                },
            });
        }

        if (!isEditMassage) {
            ApiService.send<SendMessageReq>('MSG_SEND', {
                message: {
                    text: textField.value,
                    to: currentExternalUser$.value!.user.login,
                },
            });
        }

        textField.value = '';
    };

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
            externalUserName: createElement({ tag: 'p', style: style['user-name'] }),
            externalUserStatus: createElement({ tag: 'p' }),
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
