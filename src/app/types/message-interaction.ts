import { IsDeleted, IsEdited } from '@interfaces/message-interaction';
import Message from '@pages/chat/chat-block/message/message';

export type MessageInteraction<Status extends keyof (IsDeleted & IsEdited)> = {
    message: Message & { status: Pick<IsDeleted & IsEdited, Status> };
};
