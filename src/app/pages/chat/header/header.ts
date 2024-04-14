import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import createElement from '@utils/create-element';
import SessionStorage from '@shared/session-storage/session-storage';
import { userLoginResponse$ } from '@shared/observables';
import { UserAuthRes } from '@interfaces/user-authentication-response';
import style from './header.module.scss';

@CustomSelector('Header')
class Header extends Component {
    protected elements = this.childrenElements();

    constructor() {
        super(style);

        this.createComponent();

        userLoginResponse$.subscribe((data: UserAuthRes | null) => {
            if (!data) return;
            const { userName } = this.elements;

            userName.innerText = `User: ${data.user.login}`;
        });
    }

    protected createComponent(): void {
        this.appendElements();
    }

    protected childrenElements() {
        return {
            userName: createElement({ tag: 'h4', text: `User: ${SessionStorage.getUserName()}` }),
            chatName: createElement({ tag: 'h2', text: `Fun Chat` }),
            btnsWrap: createElement({ tag: 'div', style: style['btns-wrap'] }),
            infoBtn: createElement({ tag: 'button', text: 'Info' }),
            logoutBtn: createElement({ tag: 'button', text: 'Logout' }),
        };
    }

    protected appendElements(): void {
        const { userName, chatName, btnsWrap, infoBtn, logoutBtn } = this.elements;

        btnsWrap.append(infoBtn, logoutBtn);

        this.contentWrap.append(userName, chatName, btnsWrap);
    }
}

export default Header;
