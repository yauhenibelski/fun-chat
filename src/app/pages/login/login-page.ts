import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import style from './login-page.module.scss';
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
        const passwordField = <HTMLInputElement>this.elements.passwordField.firstChild;

        firstNameField.required = true;
        firstNameField.placeholder = 'example: John';

        passwordField.required = true;
        passwordField.placeholder = '- - - - - - - -';
        passwordField.type = 'password';

        // if (localStorage.userLogged()) {
        //     loginBTN.innerText = 'Logout';
        // }

        this.addEvents();
    }

    protected childrenElements() {
        return {
            form: createElement({ tag: 'form' }),
            firstNameField: createElement({ tag: 'input', style: style['first-name'] }, true),
            passwordField: createElement({ tag: 'input', style: style.password }, true),
            loginBTN: createElement({ tag: 'button', text: 'Login' }),
        };
    }

    protected appendElements(): void {
        const { form, firstNameField, passwordField, loginBTN } = this.elements;

        form.append(firstNameField, passwordField, loginBTN);
        this.contentWrap.append(form);
    }

    protected matchInputValue(input: HTMLInputElement, minLength: number): boolean {
        const { value, validity } = input;
        if (value) {
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
        const passwordField = <HTMLInputElement>this.elements.passwordField.firstChild;
        const { form } = this.elements;
        const { loginBTN } = this.elements;

        firstNameField.oninput = () => firstNameField.setCustomValidity('');
        passwordField.oninput = () => passwordField.setCustomValidity('');

        loginBTN.onclick = () => {
            const validFirstNameField = this.matchInputValue(firstNameField, 3);
            const validPasswordField = this.matchInputValue(passwordField, 8);
            const canSubmit = validFirstNameField && validPasswordField;

            firstNameField.className = validFirstNameField ? '' : style.invalid;
            passwordField.className = validPasswordField ? '' : style.invalid;

            if (canSubmit) {
                console.log();
            }
        };
        form.onsubmit = (event: Event) => event.preventDefault();
    }
}

export default LoginPage;
