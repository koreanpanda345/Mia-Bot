import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createUser, updateCache } from "../../../core/mongodb";
import { Track, useMasterPlayer } from "discord-player";

let data = new SlashCommandBuilder()
  .setName("removetrack")
  .setDescription("Removes a track from a playlist")
  .addStringOption((options) => {
    options.setName("playlist");
    options.setDescription("the playlist to remove track from");
    options.setRequired(true);
    return options;
  })
  .addStringOption((options) => {
    options.setName("track");
    options.setDescription("the track name");
    options.setRequired(true);
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
              const arr = [];

              for (let t of _playlist!.tracks) {
                if (t !== val.tracks[0].title) arr.push(t);
              }

              _playlist!.tracks = arr;
              await user?.save().then(async () => {
                await updateCache();
              });
              ctx.followUp({
                ephemeral: true,
                content: `Removed Track(s) to playlist \`${playlist}\``,
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
