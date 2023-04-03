import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createMember, updateCache } from "../../../core/mongodb";
let data = new SlashCommandBuilder()
  .setName("editprofile")
  .setDescription("Allows you to edit your profile card")
  .addStringOption((option) => {
    option.setName("background");
    option.setDescription("The url of the background image you want to use.");
    return option;
  })
  .addStringOption((option) => {
    option.setName("description");
    option.setDescription("The description that is used for your card.");
    return option;
  })
  .addStringOption((option) => {
    option.setName("title");
    option.setDescription("Your title! it will be shown under your name!");
    return option;
  });
Creator.Command({
  data,

  invoke: async (ctx, args) => {
    let background = args.getString("background");
    let description = args.getString("description");
    let title = args.getString("title");

    let member = cache.database.members.get(ctx.user.id);

    if (!member) {
      member = await createMember(ctx.user.id);
    }

    let oldBackground = member!.card.background_url;
    let oldDescription = member!.card.description;
    let oldTitle = member!.card.title;

    if (background) member!.card.background_url = background;
    if (description) member!.card.description = description;
    if (title) member!.card.title = title;

    let embed = new EmbedBuilder();

    embed.setTitle("Profile Updated");
    embed.setDescription(`The following has been updated`);
    embed.setColor(Colors.Green);
    if (background) embed.setImage(background);
    if (title)
      embed.addFields({ name: `Title`, value: `${title}`, inline: true });
    if (description)
      embed.addFields({
        name: `Description`,
        value: `${description}`,
        inline: true,
      });

    await ctx.reply({
      ephemeral: true,
      embeds: [embed],
    });

    await member.save().then(async () => {
      await updateCache();
    });
  },
});
