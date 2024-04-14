export interface MessageStatus {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
}

interface SendMessageResProp {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: MessageStatus;
}

export interface SendMessageRes {
    message: SendMessageResProp;
}
