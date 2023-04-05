import Logger from "../../core/logger";
import Creator from "../../utils/creator";

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
