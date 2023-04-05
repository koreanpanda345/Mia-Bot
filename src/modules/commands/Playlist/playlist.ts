import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createUser } from "../../../core/mongodb";

let data = new SlashCommandBuilder()
  .setName("playlist")
  .setDescription("Sends a txt file of all of your playlists")
  .addStringOption((options) => {
    options.setName("name");
    options.setDescription("Gets a specific playlist instead of all of them");
    return options;
  });

Creator.Command({
  data,
  invoke: async (ctx, args) => {
    let user = cache.database.users.get(ctx.user.id);
    let name = args.getString("name");
    if (!user) await createUser(ctx.user.id);

    let playlists = user?.music.playlist;

    let list: string[] = [];

    if (!playlists)
      list.push(
        "You currently do not have any playlists made. You can make one by using the creatplaylist command"
      );
    else {
      if (name) {
        let playlist = playlists.find(
          (x) => x.name.toLowerCase() === name?.toLowerCase()
        );

        if (!playlist) {
          list.push(`Could not find the playlist ${name}`);
        } else {
          list.push(`Playlist: ${playlist.name}`);
          let i = 0;
          for (let track of playlist.tracks) {
            i += 1;
            list.push(`${i} - ${track}`);
          }
        }
      } else {
        for (let playlist of playlists) {
          list.push(`Playlist: ${playlist.name}`);
          let i = 0;
          for (let track of playlist.tracks) {
            i += 1;
            list.push(`${i} - ${track}`);
          }

          list.push("\n\n");
        }
      }
    }

    let attachment = new AttachmentBuilder(
      Buffer.from(list.join("\n"), "utf-8"),
      {
        name: "playlist.txt",
        description: "Your Playlists",
      }
    );

    await ctx.reply({
      ephemeral: true,
      files: [attachment],
    });
  },
});
