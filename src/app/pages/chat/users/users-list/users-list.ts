import Component from '@utils/ui-component-template';
import CustomSelector from '@utils/set-selector-name';
import { ApiService } from '@shared/api-service';
import { UserAuthPropRes, UserAuthRes } from '@interfaces/user-authentication-response';
import {
    activeUsersResponse$,
    inActiveUsersResponse$,
    userExternalLoginResponse$,
    userLoginResponse$,
    userSortValue$,
} from '@shared/observables';
import SessionStorage from '@shared/session-storage/session-storage';
import style from './users-list.module.scss';
import User from './user/user';

@CustomSelector('Users-list')
class UsersList extends Component {
    private users: User[] = [];

    constructor() {
        super(style);

        this.createComponent();

        userLoginResponse$.subscribe(this.userLoginResponseSubscribe);
        activeUsersResponse$.subscribe(this.updateUserListSubscribe);
        inActiveUsersResponse$.subscribe(this.updateUserListSubscribe);
        userExternalLoginResponse$.subscribe(this.userExternalLoginResponseSubscribe);
        userSortValue$.subscribe(() => this.render());
    }

    private userExternalLoginResponseSubscribe = (data: UserAuthRes | null) => {
        if (!data) return;

        const isNewUser = !this.users.find(({ user }) => user.login === data.user.login);

        if (isNewUser) {
            this.users = [...this.users, new User(data.user)];
            this.render();
        }
    };

    private userLoginResponseSubscribe = (data: UserAuthRes | null) => {
        if (!data) return;
        ApiService.fetchUsers();
    };

    private updateUserListSubscribe = (data: UserAuthPropRes[]) => {
        this.users = [...this.users, ...data.map(user => new User(user))];
        this.render();
    };

    protected createComponent(): void {
        this.appendElements();
    }

    protected appendElements(): void {
        if (!this.users.length) return;

        this.users.sort((a, b) => a.user.login.localeCompare(b.user.login));

        this.users
            .filter(
                ({ user }) =>
                    user.login.toLowerCase().includes(userSortValue$.value) && user.login !== SessionStorage.app.login,
            )
            .forEach(user => {
                this.contentWrap.append(user.getElement());
            });
    }
}

export default UsersList;
