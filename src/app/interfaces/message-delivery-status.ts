import { MessageStatus } from './send-message-response';

export interface MessageDeliveryStatus<Status extends keyof MessageStatus> {
    message: {
        id: string;
        status: Pick<MessageStatus, Status>;
    };
}
