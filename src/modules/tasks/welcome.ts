import {
  Colors,
  EmbedBuilder,
  GuildMember,
  TextBasedChannel,
} from "discord.js";
import Creator from "../../utils/creator";
import cache from "../../core/cache";
import Logger from "../../core/logger";

Creator.Task({
  name: "welcome_message",
  invoke: async (member: GuildMember) => {
    const logger = new Logger("Welcome Message");
    const config = cache.database.guild_configuration.get(
      member.guild.id as string
    );

    if (!config) {
      logger.warn(
        `Guild: ${member.guild.name} (${member.guild.id}) does not have a configuration`
      );
      return;
    }

    if (!config.modules.welcome) return;

    if (!config.welcome.channel_id) return;

    const channel = member.guild.channels.cache.get(
      config.welcome.channel_id
    ) as TextBasedChannel;

    if (!channel) {
      logger.warn("No welcome channel founded");
      return;
    }

    let embed = new EmbedBuilder();
    embed.setTitle(
      replaceSnippets(config.welcome.title || `Welcome <member>`, member)
    );
    embed.setColor(Colors.Gold);
    embed.setDescription(
      replaceSnippets(config.welcome.body as string, member)
    );
    embed.setImage(config.welcome.image || "");

    await channel.send({
      embeds: [embed],
    });
  },
});

function replaceSnippets(str: string, member: GuildMember) {
  if (str.includes("<member>"))
    str = str.replace(/<member>/, member.user.username);
  if (str.includes("<memberCount>"))
    str = str.replace(/<memberCount>/, member.guild.memberCount.toString());

  return str;
}
