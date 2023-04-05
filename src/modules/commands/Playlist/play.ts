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

    // let user = cache.database.users.get(ctx.user.id);
    // if (!user) await createUser(ctx.user.id);

    // let name = args.getString("playlist");
    // let playlist = user?.music.playlist.find(
    //   (x) => x.name.toLowerCase() === name?.toLowerCase()
    // );
    // if (!playlist) {
    //   ctx.reply({
    //     ephemeral: true,
    //     content: `Could not find a playlist called \`${name}\`!`,
    //   });
    //   return null;
    // }
    // let channel = (await ctx.guild?.members.fetch(ctx.member!.user.id))?.voice
    //   .channel;
    // if (!channel) {
    //   await ctx.reply({
    //     ephemeral: true,
    //     content: `You must be in a voice channel!`,
    //   });
    //   return null;
    // }

    // if (
    //   (await ctx.guild?.members.fetchMe())?.voice.channel &&
    //   (await ctx.guild?.members.fetchMe())!.voice.channel !== channel
    // ) {
    //   await ctx.reply(
    //     "It seems like someone is already using me. Please wait your turn, or join the same vc as me and queue some tracks ^-^"
    //   );
    //   return;
    // }

    // await ctx.deferReply();
    // try {
    //   const player = useMasterPlayer();
    //   if (!player) return;

    //   for (let track of playlist.tracks) {
    //     const query = await player.search(track, {
    //       searchEngine: "youtube",
    //     });

    //     let queue = useQueue(ctx.guild?.id as string);

    //     if (!queue) {
    //       const { track } = await player.play(channel, query, {
    //         nodeOptions: {
    //           metadata: ctx,
    //         },
    //       });

    //       queue = useQueue(ctx.guild?.id as string);
    //       queue?.node.setVolume(5);
    //     } else {
    //       queue.addTrack(query.tracks[0]);
    //     }
    //   }

    //   await ctx.followUp({
    //     ephemeral: true,
    //     content: `Playing Playlist \`${playlist.name}\``,
    //   });
    // } catch (err) {
    //   console.error(err);
    // }
  },
});
