import { Guild } from "discord.js";
import Creator from "../../../utils/creator";
import Handler from "../../../utils/handler";
import Logger from "../../../core/logger";
import cache from "../../../core/cache";
import { createGuildConfig } from "../../../core/mongodb";

Creator.Event({
	name: "Guild Create",
	id: "guildCreate",
	invoke: async (guild: Guild) => {
		const logger = new Logger("Guild Create");
		try {
			let config = cache.database.guild_configuration.get(guild.id as string);

			if(!config) {
				config = await createGuildConfig(guild.id as string);
			}

			return;
		} catch (error) {
			await Handler.Task('error_handler', error);
		}
	}
})