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

    protected replaceClassStyleNameToModuleClassName(
        htmlString: string,
        scssModule: { [key: string]: string },
    ): string {
        let html = htmlString;

        Object.entries(scssModule).forEach(([styleName, styleModuleName]) => {
            html = html.replaceAll(`{{${styleName}}}`, styleModuleName);
        });
        return html;
    }

    protected createComponent(): void {
        this.footerHTML = this.replaceClassStyleNameToModuleClassName(this.footerHTML, style);

        this.contentWrap.innerHTML = this.footerHTML;
    }
}
export default Footer;
