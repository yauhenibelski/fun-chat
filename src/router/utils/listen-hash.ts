import { renderPage } from './render-page';

export const listenHash = (): void => {
    window.onhashchange = () => {
        const hash = window.location.hash.slice(1);
        renderPage(hash);
    };
};
