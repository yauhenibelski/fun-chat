import { IsDeleted, IsEdited, Message } from '@interfaces/message-interaction';

export type MessageInteraction<Status extends keyof (IsDeleted & IsEdited)> = {
    message: Message & { status: Pick<IsDeleted & IsEdited, Status> };
};
