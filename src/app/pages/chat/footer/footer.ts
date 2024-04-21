import CustomSelector from '@utils/set-selector-name';
import Component from '@utils/ui-component-template';
import { replaceClassStyleNameToModuleClassName } from '@utils/replace-html-class-name';
import style from './footer.module.scss';
import footer from './footer.html';

@CustomSelector('Footer')
class Footer extends Component {
    private footerHTML = footer;

    constructor() {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        this.footerHTML = replaceClassStyleNameToModuleClassName(this.footerHTML, style);

        this.appendElements();
    }

    protected appendElements(): void {
        this.contentWrap.innerHTML = this.footerHTML;
    }
}
export default Footer;
