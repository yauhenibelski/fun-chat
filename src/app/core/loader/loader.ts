import CustomSelector from '@utils/set-selector-name';
import Component from '@utils/ui-component-template';
import createElement from '@utils/create-element';
import { showLoader$ } from '@shared/observables';
import style from './loader.module.scss';

@CustomSelector('Loader')
class Loader extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);
        this.createComponent();

        showLoader$.subscribe(boolean => {
            this.style.display = boolean ? 'flex' : 'none';
        });
    }

    protected createComponent(): void {
        this.appendElements();
    }

    protected childrenElements() {
        return {
            messageText: createElement({ tag: 'span', text: 'Connection...' }),
            spinner: createElement({ tag: 'div', style: style.spinner }),
        };
    }

    protected appendElements(): void {
        this.contentWrap.append(...Object.values(this.elements));
    }
}
export default Loader;
