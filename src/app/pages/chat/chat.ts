import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import style from './chat.module.scss';
import Header from './header/header';

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
        };
    }

    protected appendElements(): void {
        this.contentWrap.append(...Object.values(this.elements));
    }
}

export default ChatPage;
