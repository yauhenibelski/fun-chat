import { RequestType } from '../types/request.type';

export interface ChatDto<Payload> {
    id: string;
    type: RequestType;
    payload: Payload;
}
