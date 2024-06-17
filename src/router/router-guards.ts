import SessionStorage from '@shared/session-storage/session-storage';
import { RoutePath } from './types/path.type';
import { redirectTo } from './utils/redirect';
import { Routes } from './routes.const';

const guards: { [key in keyof typeof Routes]: () => boolean } = {
    login: () => {
        return !SessionStorage.isLogined() || (redirectTo('chat'), false);
    },
    chat: () => {
        return SessionStorage.isLogined() || (redirectTo('login'), false);
    },
    about: () => true,
} as const;

export const canActivate = (path: RoutePath): boolean => {
    return guards[path]();
};
