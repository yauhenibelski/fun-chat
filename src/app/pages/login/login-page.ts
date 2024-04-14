import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { ApiService } from '@shared/api-service';
import SessionStorage from '@shared/session-storage/session-storage';
import { userLoginResponse$ } from '@shared/observables';
import { UserAuthRes } from '@interfaces/user-authentication-response';
import style from './login-page.module.scss';
import { redirectTo } from '../../../router/utils/redirect';
import { Routes } from '../../../router/routes.const';

@CustomSelector('Login-page')
class LoginPage extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);

        this.createComponent();

        userLoginResponse$.subscribe(this.userLoginResponseSubscribe);
    }

    private userLoginResponseSubscribe = (data: UserAuthRes | null) => {
        if (!data) return;

        SessionStorage.saveSession(data.user);
        redirectTo(Routes.chat);
        this.render();
    };

    protected createComponent(): void {
        this.appendElements();

        const firstNameField = <HTMLInputElement>this.elements.firstNameField.firstChild;
        const passwordField = <HTMLInputElement>this.elements.passwordField.firstChild;

        firstNameField.required = true;
        firstNameField.placeholder = 'example: John';

        passwordField.required = true;
        passwordField.placeholder = '- - - - - - - -';
        passwordField.type = 'password';

        this.addEvents();
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
            if (SessionStorage.isLogined()) ApiService.logout();

            const validFirstNameField = this.matchInputValue(firstNameField, 3);
            const validPasswordField = this.matchInputValue(passwordField, 3);
            const canSubmit = validFirstNameField && validPasswordField;

            firstNameField.className = validFirstNameField ? '' : style.invalid;
            passwordField.className = validPasswordField ? '' : style.invalid;

            if (canSubmit) {
                ApiService.login(firstNameField.value, passwordField.value);
            }
        };
        form.onsubmit = (event: Event) => event.preventDefault();
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
}

export default LoginPage;
