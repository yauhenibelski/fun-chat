import { pages } from '../pages.const';
import { Routes } from '../routes.const';

export const renderPage = (path: string) => {
    if (path in Routes) {
        const routOutput = <HTMLElement>document.querySelector('.router');
        // const currentPage = <HTMLElement>routOutput.firstElementChild;
        const nextPage = pages[path as keyof typeof Routes];

        routOutput.innerHTML = '';

        routOutput.append(nextPage);
    }
};
