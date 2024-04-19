import { MessageStatus } from '@interfaces/send-message-response';

export type MessageStatusRes<Status extends keyof MessageStatus> = {
    message: {
        id: string;
        status: Pick<MessageStatus, Status>;
        text: string;
    };
};
