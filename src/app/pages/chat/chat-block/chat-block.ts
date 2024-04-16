import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { currentExternalUser$, externalUserMsgHistory$ } from '@shared/observables';
import { ApiService } from '@shared/api-service';
import { SendMessageResProp } from '@interfaces/send-message-response';
import style from './chat-block.module.scss';
import type User from '../users/users-list/user/user';
import { UserLogin } from '../../../types/user-login';

@CustomSelector('Chat-block')
class ChatBlock extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);

        this.createComponent();
        currentExternalUser$.subscribe(this.currentExternalUserSubscribe);
        externalUserMsgHistory$.subscribe(this.externalUserMsgHistorySubscribe);
    }

    private externalUserMsgHistorySubscribe = (mgs: SendMessageResProp[]): void => {
        const { dialogWindow } = this.elements;

        if (!mgs.length) {
            dialogWindow.innerHTML = 'Write your first message...';
            return;
        }

        dialogWindow.classList.remove(style['empty-dialog']);
        dialogWindow.innerHTML = '';
    };

    private currentExternalUserSubscribe = (currentUser: User | null): void => {
        if (!currentUser) return;
        const { externalUserName, externalUserStatus } = this.elements;

        externalUserName.innerText = currentUser.user.login;
        externalUserStatus.innerText = currentUser.user.isLogined ? 'online' : 'offline';

        ApiService.send<UserLogin>('MSG_FROM_USER', {
            user: {
                login: currentUser.user.login,
            },
        });
    };

    protected createComponent(): void {
        const { inputTextWrap } = this.elements;

        const textField = <HTMLInputElement>inputTextWrap.firstChild;
        textField.placeholder = 'message...';

        this.appendElements();
    }

    protected childrenElements() {
        return {
            externalUserWrap: createElement({ tag: 'div', style: style['external-user-wrap'] }),
            externalUserName: createElement({ tag: 'h4' }),
            externalUserStatus: createElement({ tag: 'h4', style: style.status }),
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
