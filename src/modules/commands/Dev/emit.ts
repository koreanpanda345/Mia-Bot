import { Guild, GuildMember, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";

Creator.Command({
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emits an event"),
  disabled: false,
  invoke: async (ctx, args) => {
    await ctx.client.emit("guildMemberAdd", ctx.member as GuildMember);
    //await ctx.client.emit("guildCreate", ctx.guild as Guild);
    await ctx.reply({
      ephemeral: true,
      content: "Success",
    });
  },
});
