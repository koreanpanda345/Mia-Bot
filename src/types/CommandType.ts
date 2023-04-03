import { CommandInteraction, CommandInteractionOptionResolver, PermissionResolvable, SlashCommandBuilder } from "discord.js";

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