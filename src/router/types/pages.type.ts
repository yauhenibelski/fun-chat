import { Routes } from '../routes.const';

export type RoutePages = {
    [key in keyof typeof Routes]: HTMLElement;
};
