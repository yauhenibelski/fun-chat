import { RequestType } from '../types/request.type';

export interface ChatRequest<Payload> {
    id: string;
    type: RequestType;
    payload: Payload;
}
