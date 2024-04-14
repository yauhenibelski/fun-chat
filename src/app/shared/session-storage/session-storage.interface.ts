export interface SessionStorageUser {
    login: string | null;
    isLogined: boolean;
}

export interface SessionStorage {
    storage: Storage;
    keyName: string;
    app: SessionStorageUser;
    isLogined(): boolean;
    checkStorage(): void;
    saveStorage(): void;
}
