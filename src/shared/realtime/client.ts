import { env } from '@/shared/config/env';

export type RealtimeHandler = (payload: unknown) => void;

export class RealtimeClient {
  private ws?: WebSocket;

  connect(onMessage: RealtimeHandler) {
    if (env.mock) return () => {};
    this.ws = new WebSocket(env.wsUrl);
    this.ws.onmessage = (event) => onMessage(JSON.parse(event.data));
    return () => this.ws?.close();
  }
}
