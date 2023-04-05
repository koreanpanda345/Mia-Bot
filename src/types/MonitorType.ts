/**
 * Type of Monitor
 */
export type MonitorType = {
	name: string;
	disabled?: boolean;
	invoke: (...args: any[]) => Promise<unknown> | unknown;
};