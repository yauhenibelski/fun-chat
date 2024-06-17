import { pages } from '../pages.const';
import { Routes } from '../routes.const';
import { canActivate } from '../router-guards';
import { RoutePath } from '../types/path.type';

export const renderPage = (path: string): void => {
    if (!(path in Routes)) return;
    if (!canActivate(path as RoutePath)) return;

    const routOutput = <HTMLElement>document.querySelector('.router');
    // const currentPage = <HTMLElement>routOutput.firstElementChild;
    const nextPage = pages[path as RoutePath];

    routOutput.innerHTML = '';

    routOutput.append(nextPage);
};
