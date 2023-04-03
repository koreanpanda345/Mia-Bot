import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import cache from "../../../core/cache";
import { createGuildConfig, updateCache } from "../../../core/mongodb";
let data = new SlashCommandBuilder()
  .setName("enable")
  .setDescription("Enables a module")
  .addStringOption((option) => {
    option.setName("module");
    option.setDescription("The module you want to enable");
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
        value: "welcome",
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
        config.modules.verify = false;
        config.modules.auto_roles = true;
        break;
      case "levels":
        config.modules.levels = true;
        break;
      case "logs":
        config.modules.logs = true;
        break;
      case "moderation":
        config.modules.moderation = true;
        break;
      case "ranks":
        config.modules.ranks = true;
        break;
      case "verify":
        config.modules.auto_roles = false;
        config.modules.verify = true;
        break;
      case "welcome":
        config.modules.welcome = true;
        break;
    }

    await ctx.reply(`Enabled ${func}`);
    await config.save().then(async () => {
      await updateCache();
    });
  },
});
