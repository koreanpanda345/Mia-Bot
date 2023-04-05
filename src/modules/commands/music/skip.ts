import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { Music } from "../../classes/Music";

let data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current track");

Creator.Command({
  data,
  invoke: async (ctx, args) => {
    let music = cache.music.player.get(ctx.guildId as string);

    if (!music) {
      music = new Music(ctx);

      cache.music.player.set(ctx.guildId as string, music);
    }

    await ctx.deferReply({
      ephemeral: true,
    });

    let queue = await music.getQueue();

    if (!queue) {
      return ctx.followUp({
        content: "There is no queue",
        ephemeral: true,
      });
    }
    let currentTrack = queue.currentTrack;
    let queuedTracks = music.getQueuedTracks();

    if (queuedTracks?.size === 0) {
      await ctx.followUp({
        content:
          "There isn't any songs after this song. I recommend you use the stop command",
        ephemeral: true,
      });
      return;
    }
    let newTrack = queuedTracks?.toArray()[0];
    await music.skip();
    let embed = new EmbedBuilder();
    embed.setTitle("Skipped Song");
    embed.setDescription(
      `Skipped **${currentTrack?.title}**\nNow going to play **${newTrack?.title}**`
    );
    embed.setColor(Colors.Green);
    ctx.followUp({
      embeds: [embed],
      ephemeral: true,
    });
  },
});
