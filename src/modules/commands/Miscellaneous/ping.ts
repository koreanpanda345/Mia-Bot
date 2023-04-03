import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";

Creator.Command({
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  invoke: async (ctx, args) => {
    await ctx.reply({
      ephemeral: true,
      content: "Pong! Motherfucker",
    });
  },
});
