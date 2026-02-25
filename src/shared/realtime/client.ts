import { env } from '@/shared/config/env';

export type RealtimeStatus = 'idle' | 'connected' | 'disconnected';
export type RealtimeEvent = { eventName: 'observation.new' | 'prediction.new'; timestamp: string; value: number };
export type RealtimeHandler = (payload: RealtimeEvent) => void;

export interface IRealtimeClient {
  status: RealtimeStatus;
  connect: () => void;
  disconnect: () => void;
  subscribe: (eventName: RealtimeEvent['eventName'], handler: RealtimeHandler) => () => void;
}

const createSeededRandom = (seed: number) => {
  let localSeed = seed;
  return () => {
    localSeed = (localSeed * 1664525 + 1013904223) % 4294967296;
    return localSeed / 4294967296;
  };
};

export class MockRealtimeClient implements IRealtimeClient {
  status: RealtimeStatus = 'idle';
  private listeners = new Map<RealtimeEvent['eventName'], Set<RealtimeHandler>>();
  private timer?: number;
  private rng = createSeededRandom(42);

  connect() {
    this.status = 'connected';
    this.timer = window.setInterval(() => {
      const eventName = this.rng() > 0.5 ? 'observation.new' : 'prediction.new';
      const payload: RealtimeEvent = {
        eventName,
        timestamp: new Date().toISOString(),
        value: Number((10 + this.rng() * 20).toFixed(2))
      };
      this.listeners.get(eventName)?.forEach((handler) => handler(payload));
    }, 5000);
  }

  disconnect() {
    this.status = 'disconnected';
    if (this.timer) window.clearInterval(this.timer);
  }

  subscribe(eventName: RealtimeEvent['eventName'], handler: RealtimeHandler) {
    const handlers = this.listeners.get(eventName) ?? new Set<RealtimeHandler>();
    handlers.add(handler);
    this.listeners.set(eventName, handlers);
    return () => handlers.delete(handler);
  }
}

export class DisabledRealtimeClient implements IRealtimeClient {
  status: RealtimeStatus = 'idle';
  connect() {
    this.status = 'idle';
  }
  disconnect() {
    this.status = 'idle';
  }
  subscribe() {
    return () => {};
  }
}

export const createRealtimeClient = (): IRealtimeClient =>
  env.realtime ? new MockRealtimeClient() : new DisabledRealtimeClient();
