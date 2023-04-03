import { CommandInteraction, Interaction } from "discord.js";
import Creator from "../../../utils/creator";
import Handler from "../../../utils/handler";

Creator.Event({
  name: "Interaction Create",
  id: "interactionCreate",
  invoke: async (ctx: Interaction) => {
    if (ctx.isCommand())
      await Handler.Monitor("slash_command", ctx as CommandInteraction);
  },
});
