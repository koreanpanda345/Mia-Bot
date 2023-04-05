import { CommandInteraction, CommandInteractionOptionResolver, PermissionResolvable, SlashCommandBuilder } from "discord.js";
/**
 * Type of Command
 */
export type CommandType = {
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	disabled?: boolean;
	permissions?: {
		self?: PermissionResolvable[];
		user?: PermissionResolvable[];
	};
	category?: string;
	invoke: (ctx: CommandInteraction, args: CommandInteractionOptionResolver) => Promise<unknown> | unknown;
};