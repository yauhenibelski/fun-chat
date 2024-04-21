import SessionStorage from '@shared/session-storage/session-storage';
import { RoutePath } from './types/path.type';
import { redirectTo } from './utils/redirect';
import { Routes } from './routes.const';

const guards: { [key in keyof typeof Routes]: (path: RoutePath) => boolean } = {
    login: path => {
        if (path !== 'login') return true;

        if (SessionStorage.isLogined()) {
            redirectTo('chat');
            return false;
        }

        return true;
    },
    chat: path => {
        if (path !== 'chat') return true;

        if (!SessionStorage.isLogined()) {
            redirectTo('login');
            return false;
        }

        return true;
    },
    about: path => !!path,
} as const;

export const canActivate = (path: RoutePath): boolean => {
    return guards[path](path);
};
