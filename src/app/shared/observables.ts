import { UserAuthPropRes, UserAuthRes } from '@interfaces/user-authentication-response';
import Observable from '@utils/observer-template';
import type User from '@pages/chat/users/users-list/user/user';
import type Message from '@pages/chat/chat-block/message/message';
import { SendMessageRes, MessagesRes } from '@interfaces/send-message-response';
import { ChatDto } from '@interfaces/dto';
import { MessageStatusRes } from '../types/message-delivery-status';
import { MessageInteraction } from '../types/message-interaction';

export const userLoginResponse$ = new Observable<UserAuthRes | null>(null);
export const userLogoutResponse$ = new Observable<UserAuthRes | null>(null);
export const userExternalLoginResponse$ = new Observable<UserAuthRes | null>(null);
export const userExternalLogoutResponse$ = new Observable<UserAuthRes | null>(null);
export const activeUsersResponse$ = new Observable<UserAuthPropRes[]>([]);
export const inActiveUsersResponse$ = new Observable<UserAuthPropRes[]>([]);
export const msgSendResponse$ = new Observable<SendMessageRes | null>(null);
export const userSortValue$ = new Observable<string>('');
export const currentExternalUser$ = new Observable<User | null>(null);
export const externalUserMsgHistory$ = new Observable<ChatDto<MessagesRes> | null>(null);
export const msgDeliverResponse$ = new Observable<MessageStatusRes<'isDelivered'> | null>(null);
export const msgReadResponse$ = new Observable<MessageStatusRes<'isReaded'> | null>(null);
export const msgDeleteResponse$ = new Observable<MessageInteraction<'isDeleted'> | null>(null);
export const editedMessageResponse$ = new Observable<MessageInteraction<'isEdited'> | null>(null);
export const editedMessage$ = new Observable<Message | null>(null);
