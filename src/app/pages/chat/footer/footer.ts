import CustomSelector from '@utils/set-selector-name';
import Component from '@utils/ui-component-template';
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
        Object.entries(style).forEach(([styleName, styleModuleName]) => {
            this.footerHTML = this.footerHTML.replaceAll(`{{${styleName}}}`, <string>styleModuleName);
        });

        this.contentWrap.innerHTML = this.footerHTML;
    }
}
export default Footer;
