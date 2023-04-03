import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createMember, updateCache } from "../../../core/mongodb";
import { profileCanvas } from "../../../canvas/profile";

Creator.Command({
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Displays your profile")
    .addUserOption((option) => {
      option.setName("member");
      option.setDescription("The user you want to get the profile of.");
      return option;
    }),

  invoke: async (ctx, args) => {
    let member = cache.database.members.get(ctx.user.id);

    if (!member) {
      setTimeout(async () => {
        await createMember(ctx.user.id);

        member = cache.database.members.get(ctx.user.id);
        await ctx.reply(
          "Sorry I did not have a profile made for you yet. Please try this command again!"
        );
      }, 2000);

      return;
    }

    let level = member!.levels.find(
      (x) => x.guild_id === (ctx.guildId as string)
    );
    console.log(level);
    if (!level) {
      level = {
        guild_id: ctx.guildId as string,
        level: 1,
        xp: 0,
        needed_xp: 0,
      };
      member!.levels.push(level);
    }

    let profile = await profileCanvas(
      member!.card.background_url,
      ctx.user.displayAvatarURL(),
      ctx.user.tag,
      level.xp,
      level.needed_xp,
      level.level,
      1
    );

    await ctx.reply({
      files: [profile],
    });
  },
});
