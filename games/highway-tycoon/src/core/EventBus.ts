export type GameEventType = 
  | 'VEHICLE_ARRIVED'
  | 'VEHICLE_REFUELED'
  | 'ROOM_BOOKED'
  | 'ROOM_CLEANED'
  | 'STORE_PURCHASE'
  | 'MEAL_SERVED'
  | 'ACCIDENT_OCCURRED'
  | 'REVIEW_RECEIVED'
  | 'LEVEL_UP'
  | 'LOW_FUEL_WARNING'
  | 'RESEARCH_COMPLETED'
  | 'CASH_EARNED'
  | 'FLOATING_TEXT'
  | 'PLAZA_LEVEL_UPGRADED'
  | 'CAPACITY_UPGRADED'
  | 'LAND_PARCEL_PURCHASED'
  | 'HIGHWAY_LANES_UPGRADED';

export interface FloatingTextEvent {
  text: string;
  x: number;
  y: number;
  color?: string;
  duration?: number;
}

export interface GameEventData {
  type: GameEventType;
  payload?: any;
}

type Listener = (data: any) => void;

class EventBus {
  private listeners: Map<GameEventType, Set<Listener>> = new Map();

  public on(type: GameEventType, callback: Listener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  public emit(type: GameEventType, payload?: any): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`Error in event listener for ${type}:`, err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const gameEvents = new EventBus();
