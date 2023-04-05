import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createUser, updateCache } from "../../../core/mongodb";
import { Track, useMasterPlayer } from "discord-player";

let data = new SlashCommandBuilder()
  .setName("addtrack")
  .setDescription("Adds a track to a playlist")
  .addStringOption((options) => {
    options.setName("playlist");
    options.setDescription("the playlist to add track(s) to");
    options.setRequired(true);
    return options;
  })
  .addStringOption((options) => {
    options.setName("track");
    options.setDescription("the track name");
    return options;
  })
  .addStringOption((options) => {
    options.setName("playlist_url");
    options.setDescription(
      "Put the youtube playlist url to add all of the tracks in."
    );
    return options;
  });
Creator.Command({
  data,
  invoke: async (ctx, args) => {
    let user = cache.database.users.get(ctx.user.id);
    if (!user) await createUser(ctx.user.id);
    let playlist = args.getString("playlist");
    let track = args.getString("track");
    let ytUrl = args.getString("playlist_url");

    let _playlist = user?.music.playlist.find(
      (x) => x.name.toLowerCase() === playlist?.toLowerCase()
    );

    if (!_playlist) {
      ctx.reply({
        ephemeral: true,
        content: `Playlist \`${playlist}\` doesn't seem to exist. Did you spell it correctly?`,
      });
      return;
    }
    await ctx.deferReply();
    try {
      const player = useMasterPlayer();
      if (!player) return;
      if (track) {
        await player
          .search(track, {
            searchEngine: "youtube",
          })
          .then(async (val) => {
            if (val) {
              _playlist?.tracks.push(val.tracks[0].title);
              await user?.save().then(async () => {
                await updateCache();
              });

              let embed = new EmbedBuilder();

              embed.setTitle("Added a new track to the playlist");
              embed.setDescription(
                `**${val.tracks[0].title}**\nChannel: ${val.tracks[0].author}\nDuration: ${val.tracks[0].duration}`
              );
              embed.setColor(Colors.Green);
              embed.setImage(val.tracks[0].thumbnail);

              ctx.followUp({
                ephemeral: true,
                embeds: [embed],
              });
            }
          });
      }
      if (ytUrl) {
        console.log(ytUrl);
      }
    } catch (error) {
      console.error();
      return null;
    }
  },
});
