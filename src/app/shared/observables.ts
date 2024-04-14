import { UserAuthPropRes, UserAuthRes } from '@interfaces/user-authentication-response';
import Observable from '@utils/observer-template';

export const userLoginResponse$ = new Observable<UserAuthRes | null>(null);
export const userLogoutResponse$ = new Observable<UserAuthRes | null>(null);
export const userExternalLoginResponse$ = new Observable<UserAuthRes | null>(null);
export const userExternalLogoutResponse$ = new Observable<UserAuthRes | null>(null);
export const activeUsersResponse$ = new Observable<UserAuthPropRes[]>([]);
export const inActiveUsersResponse$ = new Observable<UserAuthPropRes[]>([]);
// export const msgSendResponse$ = new Observable<SendMessageRes | null>(null);
// export const msgFromUserResponse$ = new Observable<SendMessageRes | null>(null);
export const userSortValue$ = new Observable<string>('');
