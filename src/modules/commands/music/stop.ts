import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import { useMasterPlayer, useQueue } from "discord-player";
import cache from "../../../core/cache";
let data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription(
    "Stops the music player and makes the bot leave the voice channel."
  );
Creator.Command({
  data,

  invoke: async (ctx, args) => {
    await ctx.deferReply();
    try {
      let music = cache.music.player.get(ctx.guildId as string);

      if (!music) {
        let embed = new EmbedBuilder();
        embed.setTitle("ERROR");
        embed.setDescription(`There is no music playing at the moment`);

        await ctx.followUp({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      await music.destroy();

      await ctx.followUp(
        "I stopped the queue and cleared it! I will also be leaving the voice channel!"
      );
    } catch (err) {}
  },
});
