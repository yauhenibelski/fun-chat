export interface UserAuthPropReq {
    login: string;
    password: string;
}
export interface UserAuthReq<T = UserAuthPropReq> {
    user: T;
}
