import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { SendMessageResProp } from '@interfaces/send-message-response';
import SessionStorage from '@shared/session-storage/session-storage';
import style from './message.module.scss';

@CustomSelector('Message')
class Message extends Component {
    protected elements = this.childrenElements();

    constructor(public message: SendMessageResProp) {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        if (this.message.from === SessionStorage.getUserName()) {
            this.contentWrap.classList.add(style.right);
        }
        this.appendElements();
    }

    protected getMessageStatus(): string {
        const { isDelivered, isEdited, isReaded } = this.message.status;
        if (isEdited) return 'edited';
        if (isReaded) return 'readed';
        return isDelivered ? 'delivered' : 'not delivered';
    }

    protected childrenElements() {
        const { from, datetime, text } = this.message;
        return {
            aboutMsgWrap: createElement({ tag: 'div', style: style['about-wrap'] }),
            from: createElement({ tag: 'p', text: from === SessionStorage.getUserName() ? 'You' : from }),
            date: createElement({ tag: 'p', text: new Date(datetime).toLocaleString() }),
            messageText: createElement({ tag: 'p', style: style['message-text'], text }),
            messageStatus: createElement({ tag: 'p', style: style.status, text: this.getMessageStatus() }),
        };
    }

    protected appendElements(): void {
        const { aboutMsgWrap, from, date, messageStatus, messageText } = this.elements;

        aboutMsgWrap.append(from, date);

        this.contentWrap.append(aboutMsgWrap, messageText, messageStatus);
    }
}

export default Message;
