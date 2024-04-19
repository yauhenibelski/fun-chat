import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';

import style from './new-message-separator.module.scss';

@CustomSelector('Message-separator')
class MessageSeparator extends Component {
    protected elements = this.childrenElements();
    public isShow = false;

    constructor() {
        super(style);

        this.createComponent();
    }

    protected connectedCallback(): void {
        this.isShow = true;
    }

    protected disconnectedCallback(): void {
        this.isShow = false;
    }

    protected createComponent(): void {
        this.appendElements();
    }

    protected childrenElements() {
        return {
            newMessageSeparator: createElement({
                tag: 'p',
                style: style['message-separator'],
                text: '---------  new message  ---------',
            }),
        };
    }

    protected appendElements(): void {
        this.contentWrap.append(...Object.values(this.elements));
    }
}

export default MessageSeparator;
