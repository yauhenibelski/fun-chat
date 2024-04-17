import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { currentExternalUser$, externalUserMsgHistory$, msgSendResponse$ } from '@shared/observables';
import { ApiService } from '@shared/api-service';
import { SendMessageRes, SendMessageResProp } from '@interfaces/send-message-response';
import { SendMessageReq } from '@interfaces/send-message-request';
import SessionStorage from '@shared/session-storage/session-storage';
import style from './chat-block.module.scss';
import type User from '../users/users-list/user/user';
import { UserLogin } from '../../../types/user-login';
import Message from './message/message';

@CustomSelector('Chat-block')
class ChatBlock extends Component {
    protected elements = this.childrenElements();
    private messages: Message[] = [];

    constructor() {
        super(style);

        this.createComponent();

        currentExternalUser$.subscribe(this.currentExternalUserSubscribe);
        externalUserMsgHistory$.subscribe(this.externalUserMsgHistorySubscribe);
        msgSendResponse$.subscribe(this.msgSendResponseSubscribe);
    }

    private msgSendResponseSubscribe = (mgs: SendMessageRes | null): void => {
        if (!currentExternalUser$.value) return;
        if (!mgs) return;

        const { login: currentExternalUserLogin } = currentExternalUser$.value.user;
        const { from: fromUserLogin } = mgs.message;

        const isSelectedUserDialogWindow =
            fromUserLogin === SessionStorage.getUserName() || currentExternalUserLogin === fromUserLogin;

        if (isSelectedUserDialogWindow) {
            const { dialogWindow } = this.elements;
            const isEmptyDialogWindow = !this.messages.length;

            if (isEmptyDialogWindow) {
                dialogWindow.classList.remove(style['empty-dialog']);
                dialogWindow.innerHTML = '';
            }

            this.saveMessage(mgs.message);

            const lastMgs = this.messages[this.messages.length - 1];
            lastMgs.scrollIntoView(false);
        }
    };

    private externalUserMsgHistorySubscribe = (mgs: SendMessageResProp[]): void => {
        const { dialogWindow } = this.elements;

        this.messages = [];

        if (!mgs.length) {
            dialogWindow.classList.add(style['empty-dialog']);
            dialogWindow.innerHTML = 'Write your first message...';
            return;
        }

        dialogWindow.classList.remove(style['empty-dialog']);
        dialogWindow.innerHTML = '';

        mgs.forEach(message => this.saveMessage(message));
    };

    private currentExternalUserSubscribe = (currentUser: User | null): void => {
        if (!currentUser) return;

        const { externalUserName, externalUserStatus, inputTextWrap, submitTextBtn } = this.elements;
        const textField = <HTMLInputElement>inputTextWrap.firstChild;

        textField.disabled = false;
        submitTextBtn.disabled = false;

        externalUserName.innerText = currentUser.user.login;
        externalUserStatus.innerText = currentUser.user.isLogined ? 'online' : 'offline';

        ApiService.send<UserLogin>('MSG_FROM_USER', {
            user: {
                login: currentUser.user.login,
            },
        });
    };

    protected createComponent(): void {
        const { inputTextWrap, textForm, submitTextBtn } = this.elements;

        const textField = <HTMLInputElement>inputTextWrap.firstChild;
        textField.placeholder = 'message...';
        textField.disabled = true;

        submitTextBtn.disabled = true;

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
        };

        this.appendElements();
    }

    protected saveMessage(message: SendMessageResProp): void {
        const { dialogWindow } = this.elements;
        const newMessage = new Message(message);

        dialogWindow.append(newMessage.getElement());

        this.messages.push(newMessage);
    }

    protected childrenElements() {
        return {
            externalUserWrap: createElement({ tag: 'div', style: style['external-user-wrap'] }),
            externalUserName: createElement({ tag: 'p' }),
            externalUserStatus: createElement({ tag: 'p', style: style.status }),
            textForm: createElement({ tag: 'form', style: style['text-form'] }),
            inputTextWrap: createElement({ tag: 'input', style: style['input-text-wrap'] }, true),
            submitTextBtn: createElement({ tag: 'button', text: 'Send' }),
            dialogWindow: createElement({
                tag: 'div',
                style: [style['dialog-window'], style['empty-dialog']],
                text: 'Select a user to start chatting',
            }),
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
            dialogWindow,
        } = this.elements;

        textForm.append(inputTextWrap, submitTextBtn);
        externalUserWrap.append(externalUserName, externalUserStatus);

        this.contentWrap.append(externalUserWrap, dialogWindow, textForm);
    }
}

export default ChatBlock;
