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
    private users: { [key: string]: User } = {};

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

        const isNewUser = !(data.user.login in this.users);

        if (isNewUser) {
            this.users = { ...this.users, ...{ [data.user.login]: new User(data.user) } };
            this.render();
        }
    };

    private userLoginResponseSubscribe = (data: UserAuthRes | null) => {
        if (!data) return;
        ApiService.fetchUsers();
    };

    private updateUserListSubscribe = (data: UserAuthPropRes[]) => {
        this.users = {
            ...this.users,
            ...Object.fromEntries(
                data.map(user => {
                    return [user.login, new User(user)];
                }),
            ),
        };
        this.render();
    };

    protected createComponent(): void {
        this.appendElements();
    }

    protected appendElements(): void {
        Object.entries(this.users).forEach(([login, userObj]) => {
            const isAppLogin = login === SessionStorage.getUserName();
            const isLoginMatchesSortValue = login.toLowerCase().includes(userSortValue$.value);

            if (isLoginMatchesSortValue && !isAppLogin) {
                this.contentWrap.append(userObj.getElement());
            }
        });
    }
}

export default UsersList;
