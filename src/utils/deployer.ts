/**
 * Handles the deployment of our slash commands
 */

import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import Logger from "../core/logger";
import cache from "../core/cache";
import client from "../core/client";

const logger = new Logger("Deployer");

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

cache.bot.commands.forEach((x) => commands.push(x.data.toJSON()));

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN as string);

(async () => {
	try {
		logger.debug(`Started refreshing ${commands.length} application (/) commands.`);

		const data: any = await rest.put(
			Routes.applicationGuildCommands(
				client.user?.id as string,
				process.env.DISCORD_TEST_GUILD_ID as string
			), { body: commands }
		);

		logger.debug(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (err) {
		logger.error(err);
		return null;
	}
})();