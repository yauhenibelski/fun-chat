export interface MessageStatus {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
}

interface SendMessageReqProp {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: MessageStatus;
}

export interface SendMessageReq {
    message: SendMessageReqProp;
}
