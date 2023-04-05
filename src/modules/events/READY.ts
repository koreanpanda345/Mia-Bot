import Logger from "../../core/logger";
import Creator from "../../utils/creator";
/**
 * The Ready event
 * Executes when the bot is ready!
 * 
 * [NOTE] - It does not actually mean that the bot is fully ready.
 * It just means that the bot has logged in.
 */
Creator.Event({
  name: "Ready Event",
  id: "ready",
  once: true,
  invoke: async () => {
    const logger = new Logger("Ready");
    await import("./../../utils/deployer");
    await import("./../../core/player");
    logger.info(`Bot is ready`);
  },
});
