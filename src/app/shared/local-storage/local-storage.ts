import { LocalStorage } from './local-storage.interface';

const localStorage: LocalStorage = {
    storage: window.localStorage,
    keyName: 'rss-puzzle',
    app: {},

    checkStorage(): boolean {
        const app = this.storage.getItem(this.keyName);
        if (app) this.app = JSON.parse(app);
        return Boolean(app);
    },

    saveStorage(): void {
        this.storage.setItem(this.keyName, JSON.stringify(this.app));
    },
};

export default localStorage;
