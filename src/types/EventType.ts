export type EventType = {
  name: string;
  id: string;
  disabled?: boolean;
  once?: boolean;
  invoke: (...args: any[]) => void;
};
