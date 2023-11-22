import { RoutePath } from '../types/path.type';

export const redirectTo = (path: RoutePath): void => {
    const currentHash = window.location.hash.slice(1);

    if (path === currentHash) return;

    window.location.hash = path;
};
