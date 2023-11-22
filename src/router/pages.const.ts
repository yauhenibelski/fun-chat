import createElement from '@utils/create-element';
import LoginPage from '@pages/login/login-page';
import { RoutePages } from './types/pages.type';

export const pages: RoutePages = {
    chat: createElement({ tag: 'div' }),
    login: new LoginPage(),
} as const;
