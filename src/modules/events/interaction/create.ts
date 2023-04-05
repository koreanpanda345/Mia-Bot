import { CommandInteraction, Interaction } from "discord.js";
import Creator from "../../../utils/creator";
import Handler from "../../../utils/handler";

/**
 * Handles the Interaction
 * Executes when an interaction has been made with the bot.
 *
 * Slash Command - [X]
 * Buttons - []
 * Modals - []
 * Select Menus - []
 */
Creator.Event({
  name: "Interaction Create",
  id: "interactionCreate",
  invoke: async (ctx: Interaction) => {
    if (ctx.isCommand())
      await Handler.Monitor("slash_command", ctx as CommandInteraction);
  },
});
