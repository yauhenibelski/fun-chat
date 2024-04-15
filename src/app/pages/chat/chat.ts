import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import style from './chat.module.scss';
import Header from './header/header';
import Users from './users/users';
import ChatBlock from './chat-block/chat-block';

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
            chatBlock: new ChatBlock().getElement(),
            chatWrap: createElement({ tag: 'div', style: style['chat-wrap'] }),
        };
    }

    protected appendElements(): void {
        const { header, users, chatWrap, chatBlock } = this.elements;

        chatWrap.append(users, chatBlock);

        this.contentWrap.append(header, chatWrap);
    }
}

export default ChatPage;
