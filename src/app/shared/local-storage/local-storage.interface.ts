export interface LocalStorageUserHintState {
    mute: boolean;
}
export interface LocalStorageUser {
    firstName: string | null;
    surname: string | null;
}

export interface LocalStorage {
    storage: Storage;
    keyName: string;
    app: {};
    checkStorage(): boolean;
    saveStorage(): void;
}
