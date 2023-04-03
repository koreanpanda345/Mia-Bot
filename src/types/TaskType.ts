export type TaskType = {
	name: string;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<unknown> | unknown;
}