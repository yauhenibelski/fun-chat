import { renderPage } from './utils/render-page';
import { Routes } from './routes.const';
import { redirectTo } from './utils/redirect';

export const router = (): void => {
    const hash = window.location.hash.slice(1);
    const startPage = Routes.login;

    if (!hash) {
        renderPage(startPage);
        redirectTo(startPage);
    }

    if (hash) {
        renderPage(hash);
    }

    window.onhashchange = () => {
        const hash = window.location.hash.slice(1);
        renderPage(hash);
    };
};
