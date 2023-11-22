import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import style from './login-page.module.scss';
// import localStorage from '../../shared/local-storage/local-storage';
// import { Routes } from '../../../router/routes.enum';
// import { redirectTo } from '../../../router/utils/redirect';

@CustomSelector('Login-page')
class LoginPage extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);
    }

    protected connectedCallback(): void {
        this.render();
    }

    protected createComponent(): void {
        // const { loginBTN } = this.elements;

        this.appendElements();

        const firstNameField = <HTMLInputElement>this.elements.firstNameField.firstChild;
        const secondNameField = <HTMLInputElement>this.elements.secondNameField.firstChild;

        firstNameField.required = true;
        firstNameField.placeholder = 'example: John';

        secondNameField.required = true;
        secondNameField.placeholder = 'example: Smith';

        // if (localStorage.userLogged()) {
        //     loginBTN.innerText = 'Logout';
        // }

        this.addEvents();
    }

    protected childrenElements() {
        return {
            form: createElement({ tag: 'form' }),
            firstNameField: createElement({ tag: 'input', style: style['first-name'] }, true),
            secondNameField: createElement({ tag: 'input', style: style['second-name'] }, true),
            loginBTN: createElement({ tag: 'button', text: 'Login' }),
        };
    }

    protected appendElements(): void {
        const { form, firstNameField, secondNameField, loginBTN } = this.elements;

        form.append(firstNameField, secondNameField, loginBTN);
        this.contentWrap.append(form);
    }

    protected matchInputValue(input: HTMLInputElement, minLength: number): boolean {
        const { value, validity } = input;
        if (value) {
            if (!value[0].match('[A-Z]')) {
                input.setCustomValidity('First letter should be in uppercase.');
                return false;
            }

            // eslint-disable-next-line prettier/prettier, no-useless-escape
            if (!value.match('^[a-zA-Z-]+$')) {
                input.setCustomValidity('Only the symbol "-" is allowed');
                return false;
            }

            // eslint-disable-next-line no-useless-escape
            if (!value.match(`^[a-zA-Z\-]{${minLength}}`)) {
                input.setCustomValidity(`Minimum length ${minLength} characters`);
                return false;
            }
        }
        input.setCustomValidity('');
        return validity.valid;
    }

    protected addEvents(): void {
        const firstNameField = <HTMLInputElement>this.elements.firstNameField.firstChild;
        const secondNameField = <HTMLInputElement>this.elements.secondNameField.firstChild;
        const { form } = this.elements;
        const { loginBTN } = this.elements;

        firstNameField.oninput = () => firstNameField.setCustomValidity('');
        secondNameField.oninput = () => secondNameField.setCustomValidity('');

        loginBTN.onclick = () => {
            // if (localStorage.userLogged()) {
            //     localStorage.storage.clear();
            //     // eslint-disable-next-line no-restricted-globals
            //     location.reload();
            // }

            const validFirstNameField = this.matchInputValue(firstNameField, 3);
            const validSecondNameField = this.matchInputValue(secondNameField, 4);
            const canSubmit = validFirstNameField && validSecondNameField;

            firstNameField.className = validFirstNameField ? '' : style.invalid;
            secondNameField.className = validSecondNameField ? '' : style.invalid;

            if (canSubmit) {
                // localStorage.saveUserName({
                //     firstName: firstNameField.value,
                //     surname: secondNameField.value,
                // });
                // redirectTo(Routes.startScreen);
            }
        };
        form.onsubmit = (event: Event) => event.preventDefault();
    }
}

export default LoginPage;
