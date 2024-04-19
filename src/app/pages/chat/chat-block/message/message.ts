import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { MessageStatus, SendMessageResProp } from '@interfaces/send-message-response';
import SessionStorage from '@shared/session-storage/session-storage';
import { ApiService } from '@shared/api-service';
import { MessageChangeStatus } from '@interfaces/message-interaction';
import { editedMessage$ } from '@shared/observables';
import style from './message.module.scss';

@CustomSelector('Message')
class Message extends Component {
    protected elements = this.childrenElements();

    constructor(public message: SendMessageResProp) {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        const { deleteBtn, editBtn } = this.elements;
        const isOwnMessage = this.message.from === SessionStorage.getUserName();

        editBtn.onclick = () => editedMessage$.publish(this);
        deleteBtn.onclick = () =>
            ApiService.send<MessageChangeStatus>('MSG_DELETE', {
                message: { id: this.message.id },
            });

        if (isOwnMessage) {
            this.contentWrap.classList.add(style.right);

            this.contentWrap.oncontextmenu = event => {
                event.preventDefault();

                this.openCloseOptions();
                this.setCloseOptionsOnDocumentEvent();
            };
        }

        this.appendElements();
    }

    protected setCloseOptionsOnDocumentEvent(): void {
        /* нет, это не костыль :) */
        setTimeout(() => {
            document.body.oncontextmenu = e => {
                e.preventDefault();

                this.openCloseOptions();
                document.body.onclick = null;
                document.body.oncontextmenu = null;
            };

            document.body.onclick = () => {
                this.openCloseOptions();
                document.body.onclick = null;
                document.body.oncontextmenu = null;
            };
        });
    }

    updateMessage(status: boolean, type: keyof MessageStatus): void {
        // debugger
        this.message.status[type] = status;
        this.render();
    }

    protected openCloseOptions() {
        const { optionsWrap } = this.elements;
        optionsWrap.classList.toggle(style['options-wrap-open']);
    }

    protected getMessageStatus(): string {
        const {
            from,
            status: { isDelivered, isEdited, isReaded },
        } = this.message;
        const isOwnMessage = from === SessionStorage.getUserName();

        if (isOwnMessage) {
            if (isReaded) return 'readed';
            return isDelivered ? 'delivered' : 'not delivered';
        }

        return isEdited ? 'edited' : '';
    }

    protected isOwnMessage(): boolean {
        const { from } = this.message;
        return from === SessionStorage.getUserName();
    }

    protected childrenElements() {
        const { from, datetime, text, status } = this.message;
        return {
            aboutMsgWrap: createElement({ tag: 'div', style: style['about-wrap'] }),
            from: createElement({ tag: 'p', text: this.isOwnMessage() ? 'You' : from }),
            date: createElement({ tag: 'p', text: new Date(datetime).toLocaleString() }),
            messageText: createElement({ tag: 'p', style: style['message-text'], text }),
            messageStatusWrap: createElement({ tag: 'div', style: style['status-wrap'] }),
            messageStatus: createElement({ tag: 'p', style: style.status, text: this.getMessageStatus() }),
            messageEditedNote: createElement({ tag: 'p', text: status.isEdited ? 'edited' : '' }),
            optionsWrap: createElement({ tag: 'div', style: style['options-wrap'] }),
            editBtn: createElement({ tag: 'button', text: 'Edit' }),
            deleteBtn: createElement({ tag: 'button', text: 'Delete' }),
        };
    }

    protected appendElements(): void {
        const {
            aboutMsgWrap,
            from,
            date,
            messageStatus,
            messageText,
            optionsWrap,
            editBtn,
            deleteBtn,
            messageEditedNote,
            messageStatusWrap,
        } = this.elements;

        const messageStatusNote = this.isOwnMessage() ? [messageEditedNote, messageStatus] : [messageStatus];

        aboutMsgWrap.append(from, date);
        optionsWrap.append(editBtn, deleteBtn);
        messageStatusWrap.append(...messageStatusNote);

        this.contentWrap.append(aboutMsgWrap, messageText, messageStatusWrap, optionsWrap);
    }
}

export default Message;
