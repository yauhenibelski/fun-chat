import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import style from './chat.module.scss';
import Header from './header/header';
import Users from './users-block/users';
import ChatBlock from './chat-block/chat-block';
import Footer from './footer/footer';

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
            footer: new Footer().getElement(),
            users: new Users().getElement(),
            chatBlock: new ChatBlock().getElement(),
            chatWrap: createElement({ tag: 'div', style: style['chat-wrap'] }),
        };
    }

    protected appendElements(): void {
        const { header, users, chatWrap, chatBlock, footer } = this.elements;

        chatWrap.append(users, chatBlock);

        this.contentWrap.append(header, chatWrap, footer);
    }
}

export default ChatPage;
