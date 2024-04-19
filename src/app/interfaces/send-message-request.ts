interface SendMessageReqProp {
    id: string;
    to: string;
    text: string;
}

export interface SendMessageReq {
    message: Omit<SendMessageReqProp, 'id'>;
}

export interface ChangeStatusMessageReq {
    message: Omit<SendMessageReqProp, 'to'>;
}
