import LoginPage from '@pages/login/login-page';
import ChatPage from '@pages/chat/chat';
import AboutPage from '@pages/about/about';
import { RoutePages } from './types/pages.type';

export const pages: RoutePages = {
    chat: new ChatPage(),
    login: new LoginPage(),
    about: new AboutPage(),
} as const;
