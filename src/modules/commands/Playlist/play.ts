import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createUser } from "../../../core/mongodb";
import { useMasterPlayer, useQueue } from "discord-player";

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
    let playlist = user?.music.playlist.find(
      (x) => x.name.toLowerCase() === name?.toLowerCase()
    );
    if (!playlist) {
      ctx.reply({
        ephemeral: true,
        content: `Could not find a playlist called \`${name}\`!`,
      });
      return null;
    }
    let channel = (await ctx.guild?.members.fetch(ctx.member!.user.id))?.voice
      .channel;
    if (!channel) {
      await ctx.reply({
        ephemeral: true,
        content: `You must be in a voice channel!`,
      });
      return null;
    }

    if (
      (await ctx.guild?.members.fetchMe())?.voice.channel &&
      (await ctx.guild?.members.fetchMe())!.voice.channel !== channel
    ) {
      await ctx.reply(
        "It seems like someone is already using me. Please wait your turn, or join the same vc as me and queue some tracks ^-^"
      );
      return;
    }

    await ctx.deferReply();
    try {
      const player = useMasterPlayer();
      if (!player) return;

      for (let track of playlist.tracks) {
        const query = await player.search(track, {
          searchEngine: "youtube",
        });

        let queue = useQueue(ctx.guild?.id as string);

        if (!queue) {
          const { track } = await player.play(channel, query, {
            nodeOptions: {
              metadata: ctx,
            },
          });

          queue = useQueue(ctx.guild?.id as string);
          queue?.node.setVolume(5);
        } else {
          queue.addTrack(query.tracks[0]);
        }
      }

      await ctx.followUp({
        ephemeral: true,
        content: `Playing Playlist \`${playlist.name}\``,
      });
    } catch (err) {
      console.error(err);
    }
  },
});
