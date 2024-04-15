import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import { UserAuthPropRes, UserAuthRes } from '@interfaces/user-authentication-response';
import createElement from '@utils/create-element';
import { currentExternalUser$, userExternalLoginResponse$, userExternalLogoutResponse$ } from '@shared/observables';
import style from './user.module.scss';

@CustomSelector('User')
class User extends Component {
    protected elements = this.childrenElements();

    constructor(public user: UserAuthPropRes) {
        super(style);

        this.createComponent();
        userExternalLoginResponse$.subscribe(this.updateUserSubscribe);
        userExternalLogoutResponse$.subscribe(this.updateUserSubscribe);
    }

    protected updateUserSubscribe = (data: UserAuthRes | null) => {
        if (!data) return;

        if (data.user.login === this.user.login) {
            this.user = data.user;
            this.render();
        }
    };

    protected createComponent(): void {
        this.onclick = () => currentExternalUser$.publish(this);

        this.appendElements();
    }

    protected childrenElements() {
        return {
            userName: createElement({ tag: 'p', text: this.user.login }),
            userWrap: createElement({
                tag: 'div',
                style: [style.user, this.user.isLogined ? style.active : ''],
            }),
        };
    }

    protected appendElements(): void {
        const { userName, userWrap } = this.elements;

        userWrap.append(userName);
        this.contentWrap.append(userWrap);
    }
}

export default User;
