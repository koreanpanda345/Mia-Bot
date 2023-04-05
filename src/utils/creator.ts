import cache from "../core/cache";
import client from "../core/client";
import { CommandType } from "../types/CommandType";
import { EventType } from "../types/EventType";
import { MonitorType } from "../types/MonitorType";
import { TaskType } from "../types/TaskType";
/**
 * contains all of the creation methods.
 */
const Creator = {
	/**
	 * Creates a new event.
	 * @param event - Event
	 * @returns 
	 */
	Event: (event: EventType) => {
		if(cache.bot.events.has(event.name)) return;

		if(event.once) client.once(event.id, async (...args) => await event.invoke(...args));
		else client.on(event.id, async (...args) => await event.invoke(...args));

		cache.bot.events.set(event.name, event);
	},
	/**
	 * Creates a new Monitor
	 * @param monitor - Monitor
	 * @returns 
	 */
	Monitor: (monitor: MonitorType) => {
		if(cache.bot.monitors.has(monitor.name)) return;

		cache.bot.monitors.set(monitor.name, monitor);
	},
	/**
	 * Creates a new Command
	 * @param command - Command
	 * @returns 
	 */
	Command: (command: CommandType) => {
		if(cache.bot.commands.has(command.data.name)) return;

		cache.bot.commands.set(command.data.name, command);
	},
	/**
	 * Creates a new Task
	 * @param task - Task
	 * @returns 
	 */
	Task: (task: TaskType) => {
		if(cache.bot.commands.has(task.name)) return;

		cache.bot.tasks.set(task.name, task);
	}
}

export default Creator;