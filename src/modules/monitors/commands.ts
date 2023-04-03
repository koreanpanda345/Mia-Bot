import { CommandInteraction } from "discord.js";
import Creator from "../../utils/creator";
import cache from "../../core/cache";
import Logger from "../../core/logger";
import Handler from "../../utils/handler";

Creator.Monitor({
	name: "slash_command",
	invoke: async (ctx: CommandInteraction) => {
		const logger = new Logger("Slash Command Executed");
		try {
			await Handler.Commands(ctx);
			logger.debug(`Command ${ctx.commandName} was executed`);
		} catch (err) {
			logger.error(err);
			return null;
		}
	}
});