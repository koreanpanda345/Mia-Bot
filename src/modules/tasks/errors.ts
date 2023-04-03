import { CommandInteraction, EmbedBuilder } from "discord.js";
import Logger from "../../core/logger";
import Creator from "../../utils/creator";

Creator.Task({
  name: "error_handler",
  invoke: async (err: any, ctx?: CommandInteraction) => {
    const logger = new Logger("Error Handler");
    logger.error(err);
    console.log(err);
    if (ctx) {
      let embed = new EmbedBuilder();
      embed.setTitle("ERROR");
      embed.setColor("Red");
      embed.setDescription(`The following has occurred:\n\n\`\`\`${err}\`\`\``);

      await ctx.reply({ embeds: [embed] });
    }
  },
});
