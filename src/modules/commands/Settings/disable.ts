import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createGuildConfig, updateCache } from "../../../core/mongodb";
let data = new SlashCommandBuilder()
  .setName("disable")
  .setDescription("Disables a module")
  .addStringOption((option) => {
    option.setName("module");
    option.setDescription("The module you want to disable");
    option.setRequired(true);
    option.setChoices(
      {
        name: "Auto Roles",
        value: "autorole",
      },
      {
        name: "Levels",
        value: "levels",
      },
      {
        name: "Logs",
        value: "logs",
      },
      {
        name: "Moderation",
        value: "moderation",
      },
      {
        name: "Ranks",
        value: "ranks",
      },
      {
        name: "Verify",
        value: "verify",
      },
      {
        name: "Welcome",
        value: "welcom",
      }
    );
    return option;
  });
Creator.Command({
  data,
  permissions: {
    user: ["ManageGuild"],
  },
  invoke: async (ctx, args) => {
    let func = args.getString("module");

    let config = cache.database.guild_configuration.get(ctx.guildId as string);
    if (!config) {
      config = await createGuildConfig(ctx.guildId as string);
    }

    switch (func) {
      case "autorole":
        config.modules.auto_roles = false;
        break;
      case "levels":
        config.modules.levels = false;
        break;
      case "logs":
        config.modules.logs = false;
        break;
      case "moderation":
        config.modules.moderation = false;
        break;
      case "ranks":
        config.modules.ranks = false;
        break;
      case "verify":
        config.modules.verify = false;
        break;
      case "welcome":
        config.modules.welcome = false;
        break;
    }

    await ctx.reply(`Disabled ${func}`);
    await config.save().then(async () => {
      await updateCache();
    });
  },
});
