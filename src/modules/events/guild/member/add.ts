import { GuildMember } from "discord.js";
import Creator from "../../../../utils/creator";
import Handler from "../../../../utils/handler";
import Logger from "../../../../core/logger";

Creator.Event({
	name: "Guild Member Add",
	id: "guildMemberAdd",
	invoke: async (member: GuildMember) => {
		const logger = new Logger("Guild Member Add");
		try {
			logger.debug(`Guild Member Joined`);
			logger.debug(`Joined ${member.guild.name} (${member.guild.id})`);
			await Handler.Monitor('auto_role', member);
			await Handler.Task('welcome_message', member);
		} catch(err) {
			await Handler.Task("error_handler", err);
		}
	}
});