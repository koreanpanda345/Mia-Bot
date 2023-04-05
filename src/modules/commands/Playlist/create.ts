import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createUser, updateCache } from "../../../core/mongodb";

let data = new SlashCommandBuilder()
  .setName("createplaylist")
  .setDescription("Creates a new playlist")
  .addStringOption((options) => {
    options.setName("name");
    options.setDescription("The name of the new playlist");
    options.setRequired(true);
    return options;
  });
Creator.Command({
  data,

  invoke: async (ctx, args) => {
    let user = cache.database.users.get(ctx.user.id);
    let name = args.getString("name");
    if (!user) await createUser(ctx.user.id);
    if (!name) {
      ctx.reply({
        ephemeral: true,
        content: `Please try this command again, but add the name of the new playlist in.`,
      });
      return;
    }
    let playlist: {
      name: string;
      tracks: string[];
    } = {
      name: name,
      tracks: [],
    };

    if (user?.music.playlist.find((x) => x.name === name)) {
      ctx.reply({
        ephemeral: true,
        content: `The name \`${name}\` has already been used for a playlist.`,
      });
      return;
    }

    user?.music.playlist.push(playlist);
    user?.save().then(async () => {
      await updateCache();
    });
    ctx.reply({
      ephemeral: true,
      content: `Created a new playlist called \`${name}\`!`,
    });
  },
});
