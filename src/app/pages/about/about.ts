import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { replaceHtmlClassStyleNameToModuleClassName } from '@utils/replace-html-class-name';
import style from './about.module.scss';
import about from './about.html';
import { redirectTo } from '../../../router/utils/redirect';

@CustomSelector('About-page')
class AboutPage extends Component {
    private aboutHTML = about;
    protected elements = this.childrenElements();

    constructor() {
        super(style);

        this.createComponent();
    }

    protected createComponent(): void {
        this.aboutHTML = replaceHtmlClassStyleNameToModuleClassName(this.aboutHTML, style);

        const { goBackBtn } = this.elements;

        goBackBtn.onclick = () => redirectTo('login');

        this.appendElements();
    }

    protected childrenElements() {
        return {
            goBackBtn: createElement({ tag: 'button', text: 'Go back' }),
        };
    }

    protected appendElements(): void {
        const { goBackBtn } = this.elements;

        this.contentWrap.innerHTML = this.aboutHTML;
        this.contentWrap.append(goBackBtn);
    }
}

export default AboutPage;
