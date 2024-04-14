import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import style from './chat.module.scss';
import Header from './header/header';
import Users from './users/users';

@CustomSelector('Chat-page')
class ChatPage extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        this.appendElements();
    }

    protected childrenElements() {
        return {
            header: new Header().getElement(),
            users: new Users().getElement(),
            chatWrap: createElement({ tag: 'div', style: style['chat-wrap'] }),
        };
    }

    protected appendElements(): void {
        const { header, users, chatWrap } = this.elements;

        chatWrap.append(users);

        this.contentWrap.append(header, chatWrap);
    }
}

export default ChatPage;
