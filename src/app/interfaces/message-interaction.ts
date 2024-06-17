export interface IsEdited {
    isEdited: boolean;
}

export interface IsDeleted {
    isDeleted: boolean;
}
export interface Message {
    id: string;
    text: string;
}

export interface MessageChangeStatus {
    message: Pick<Message, 'id'>;
}
