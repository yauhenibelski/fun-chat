import { UserAuthPropReq, UserAuthReq } from '@interfaces/user-authentication-request';

export type UserLogin = UserAuthReq<Pick<UserAuthPropReq, 'login'>>;
