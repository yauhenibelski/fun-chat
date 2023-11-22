import CustomSelector from '@utils/set-selector-name';
import Component from '@utils/ui-component-template';
import createElement from '@utils/create-element';
import style from './popup.module.scss';

@CustomSelector('Popup')
class PopUp extends Component {
    constructor(private content: HTMLElement | string) {
        super(style);

        this.createComponent();
    }

    static show(content: HTMLElement | string) {
        document.body.append(new PopUp(content).getElement());
    }

    protected createComponent(): void {
        this.contentWrap.style.opacity = '0';
        document.body.style.overflow = 'hidden';

        const content =
            this.content instanceof HTMLElement ? this.content : createElement({ tag: 'h2', text: this.content });

        this.contentWrap.append(content);
        // content.onclick = event => event.stopPropagation();

        this.contentWrap.onclick = () => this.close();

        setTimeout(() => {
            this.contentWrap.style.opacity = '1';
        }, 100);
    }

    close() {
        this.contentWrap.style.opacity = '0';
        this.contentWrap.innerHTML = '';

        document.body.style.overflow = '';

        setTimeout(() => {
            this.remove();
        }, 200);
    }
}
export default PopUp;
