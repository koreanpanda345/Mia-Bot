import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import Logger from "../core/logger";
import cache from "../core/cache";

const logger = new Logger("Handler");

const Handler = {
  /**
   * Handles Slash Commands
   * @param ctx Command Context
   */
  Commands: async (ctx: CommandInteraction) => {
    try {
      let args = ctx.options as CommandInteractionOptionResolver;
      const command = cache.bot.commands.get(ctx.commandName);
      if (!command) {
        ctx.reply({
          ephemeral: true,
          content: `Command ${ctx.commandName} does not exist.`,
        });
        return;
      } else if (command.disabled) {
        ctx.reply({
          ephemeral: true,
          content: `Command ${command.data.name} is disabled at the moment. Please Wait!!!`,
        });
        return;
      }

      if (command.permissions)
        if (command.permissions.self) {
          if (!ctx.guild?.members.me?.permissions.any(command.permissions.self))
            return ctx.reply({
              ephemeral: true,
              content: `I currently do not have the correct permissions to use this command!`,
            });
        } else if (command.permissions.user) {
          if (!ctx.memberPermissions?.any(command.permissions.user))
            return ctx.reply({
              ephemeral: true,
              content: `You currently do not have the correct permissions to use this command!`,
            });
        }

      await command.invoke(ctx, args);
    } catch (err) {
      await Handler.Task("error_handler", err, ctx);
      return null;
    }
  },

  Monitor: async (name: string, ...args: any[]) => {
    try {
      const monitor = cache.bot.monitors.get(name);

      if (!monitor) {
        logger.warn(`Monitor ${monitor} doesn't seem to exist!`);
        return null;
      } else if (monitor.disabled) {
        logger.warn(`Monitor ${monitor} is disabled at the moment`);
        return null;
      }

      await monitor.invoke(...args);
    } catch (err) {
      logger.error(err);
      return null;
    }
  },
  Task: async (name: string, ...args: any[]) => {
    try {
      const task = cache.bot.tasks.get(name);

      if (!task) {
        logger.warn(`Task ${name} doesn't seem to exist!`);
        return null;
      } else if (task.disabled) {
        logger.warn(`Task ${name} is disabled at the moment!`);
        return null;
      }

      await task.invoke(...args);
    } catch (err) {
      await Handler.Task("error_handler", err);
      return null;
    }
  },
};

export default Handler;
