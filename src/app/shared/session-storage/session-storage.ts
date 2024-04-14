import { UserAuthPropRes } from '@interfaces/user-authentication-response';

const SessionStorage = {
    storage: window.sessionStorage,
    keyName: 'fun-chat',
    app: {
        login: '',
        isLogined: false,
    },

    checkStorage(): void {
        const app = this.storage.getItem(this.keyName);

        if (app) {
            this.app = JSON.parse(app);
        }
    },

    saveSession(data: UserAuthPropRes): void {
        this.app = data;
        this.saveStorage();
    },

    isLogined(): boolean {
        this.checkStorage();
        return this.app.isLogined;
    },

    getUserName(): string {
        this.checkStorage();
        return this.app.login;
    },

    saveStorage(): void {
        this.storage.setItem(this.keyName, JSON.stringify(this.app));
    },
};

export default SessionStorage;
