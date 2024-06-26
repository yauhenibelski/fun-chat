import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import { ApiService } from '@shared/api-service/api-service';
import SessionStorage from '@shared/session-storage/session-storage';
import { showLoader$, userLoginResponse$ } from '@shared/observables';
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

        userLoginResponse$.subscribe(this.handleUserLoginResponse);
    }

    private handleUserLoginResponse = (data: UserAuthRes | null) => {
        if (!data) return;

        SessionStorage.saveSession(data.user);
        redirectTo(Routes.chat);
        showLoader$.publish(false);
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

    protected isLoginValid(input: HTMLInputElement, minLength: number): boolean {
        const { value, validity } = input;
        if (value.match(/\s/)) {
            input.setCustomValidity(`Invalid Login`);
            return false;
        }

        if (value.length < minLength) {
            input.setCustomValidity(`Minimum length ${minLength}`);
            return false;
        }

        input.setCustomValidity('');

        return validity.valid;
    }

    protected isPasswordValid(input: HTMLInputElement, minLength: number): boolean {
        const { value, validity } = input;
        if (value.match(/\s/)) {
            input.setCustomValidity(`Invalid Password`);
            return false;
        }

        if (value.length < minLength) {
            input.setCustomValidity(`Minimum length ${minLength}`);
            return false;
        }

        if (!value.match(/[A-Z]+/)) {
            input.setCustomValidity(`Must be at least one capital letter`);
            return false;
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

            const validFirstNameField = this.isLoginValid(firstNameField, 4);
            const validPasswordField = this.isPasswordValid(passwordField, 8);
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
