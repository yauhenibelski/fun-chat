import CustomSelector from '@utils/set-selector-name';
import Component from '@utils/ui-component-template';
import createElement from '@utils/create-element';
import style from './error-message.module.scss';
import { Popup } from '../../core/popup/popup';

@CustomSelector('Error-message')
class ErrorMessage extends Component {
    protected elements = this.childrenElements();

    constructor(private message: string) {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        const { confirmBtn } = this.elements;
        confirmBtn.onclick = () => Popup.close();

        this.appendElements();
    }

    protected childrenElements() {
        return {
            messageText: createElement({ tag: 'p', text: this.message }),
            confirmBtn: createElement({ tag: 'button', text: 'OK' }),
        };
    }

    protected appendElements(): void {
        this.contentWrap.append(...Object.values(this.elements));
    }
}
export default ErrorMessage;
