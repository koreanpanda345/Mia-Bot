import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createUser } from "../../../core/mongodb";
import { Track, useMasterPlayer, useQueue } from "discord-player";
import { Music } from "../../classes/Music";
import Handler from "../../../utils/handler";

let data = new SlashCommandBuilder()
  .setName("playplaylist")
  .setDescription("Plays one of your playlist")
  .addStringOption((options) => {
    options.setName("playlist");
    options.setDescription("Name of the playlist");
    options.setRequired(true);
    return options;
  });
Creator.Command({
  data,
  invoke: async (ctx, args) => {
    let user = cache.database.users.get(ctx.user.id);
    if (!user) await createUser(ctx.user.id);

    let name = args.getString("playlist");
    let music = cache.music.player.get(ctx.guildId as string);
    let playlist = user?.music.playlist.find(
      (x) => x.name.toLowerCase() === name?.toLowerCase()
    );
    if (!music) {
      music = new Music(ctx);
      cache.music.player.set(ctx.guildId as string, music);
    }

    if (!playlist) {
      await ctx.reply({
        content: `Doesn't look like there is a playlist by that name`,
        ephemeral: true,
      });
    }
    await ctx.deferReply();
    let check = await music.checkAvailibility(true);
    if (check) {
      return ctx.followUp({
        embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(check)],
        ephemeral: true,
      });
    }

    const queue = await music.createQueue();

    if (!queue) {
      return ctx.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription("There was an error while creating the queue."),
        ],
      });
    }
    let tracks: Track[] = [];
    for (let track of playlist!.tracks) {
      let result = await music.search(track);

      tracks.push(result.tracks[0]);
    }

    await queue.addTrack(tracks);

    const embed = new EmbedBuilder();

    embed.setDescription(
      `Playing Playlist **${playlist?.name}**\nStarting the playlist with ${playlist?.tracks[0]}`
    );

    if (!(await music.isPlaying())) {
      await music
        .play()
        .then(async () => {
          await ctx.followUp({
            embeds: [embed],
          });
        })
        .catch(async (error) => {
          await Handler.Task("error_handler", error, ctx);
        });
    } else {
      await ctx.followUp({
        embeds: [embed],
      });
    }
  },
});
