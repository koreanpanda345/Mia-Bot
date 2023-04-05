import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";

let data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips the current track");

Creator.Command({
  data,
  invoke: async (ctx, args) => {
    const music = cache.music.player.get(ctx.guildId as string);

    await ctx.deferReply({
      ephemeral: true,
    });

    const check = await music?.checkAvailibility();
    if (check) {
      return await ctx.followUp({
        embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(check)],
        ephemeral: true,
      });
    }

    const queue = await music?.getQueue();

    if (!music?.isPlaying())
      return await ctx.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription("There is no song playing right now"),
        ],
      });

    if (!queue) {
      return await ctx.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription("Queue ended. Silence...."),
        ],
        ephemeral: true,
      });
    }

    const previousTrack = queue.currentTrack;
    const queuedTracks = (await music.getQueuedTracks())!.data;

    if (queue.tracks.size < 0) await music.play();
    else await queue.node.skip();

    const nextSong = queuedTracks[0];

    if (!nextSong)
      return await ctx
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Red)
              .setDescription("Queue Ended. Silence...."),
          ],
          ephemeral: true,
        })
        .catch((e) => {});

    let embed = new EmbedBuilder();
    embed.setColor(Colors.Green);
    embed.setDescription(
      `**${previousTrack} has been skipped` +
        `\n----------------------------\n` +
        `Now Playing: [${nextSong.title}](${nextSong.url})\n` +
        `Requested by: ${nextSong.requestedBy}\n` +
        `Duration: ${nextSong.duration}\n`
    );

    return await ctx.followUp({
      embeds: [embed],
    });
  },
});
