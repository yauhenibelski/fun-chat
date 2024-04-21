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

        userLoginResponse$.subscribe(this.handleUserLoginResponse);
        activeUsersResponse$.subscribe(this.updateUserList);
        inActiveUsersResponse$.subscribe(this.updateUserList);
        userExternalLoginResponse$.subscribe(this.handleExternalUserLoginResponse);
        userSortValue$.subscribe(() => this.render());
    }

    private handleExternalUserLoginResponse = (data: UserAuthRes | null) => {
        if (!data) return;

        const isNewUser = !(data.user.login in this.users);

        if (isNewUser) {
            this.users = { ...this.users, ...{ [data.user.login]: new User(data.user) } };
            this.render();
        }
    };

    private handleUserLoginResponse = (data: UserAuthRes | null) => {
        if (!data) return;
        ApiService.fetchUsers();
    };

    private updateUserList = (data: UserAuthPropRes[]) => {
        this.users = {
            ...this.users,
            ...Object.fromEntries(
                data
                    .filter(({ login }) => {
                        const isAppLogin = login === SessionStorage.getUserName();

                        return !isAppLogin && !(login in this.users);
                    })
                    .map(user => {
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
            const isLoginMatchesSortValue = login.toLowerCase().includes(userSortValue$.value);

            if (isLoginMatchesSortValue) {
                this.contentWrap.append(userObj.getElement());
            }
        });
    }
}

export default UsersList;
