import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import { useQueue } from "discord-player";

let data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Displays the current queue");
Creator.Command({
  data,

  invoke: async (ctx, args) => {
    let queue = useQueue(ctx.guildId as string);
    if (!queue) {
      ctx.reply({
        ephemeral: true,
        content: "There doesn't seem to be a queue at the moment",
      });
      return;
    }

    let embed = new EmbedBuilder();
    embed.setTitle("Current Queue");
    embed.setDescription(`**Now Playing: ${queue.currentTrack?.title}**`);
    embed.setThumbnail(queue.currentTrack?.thumbnail as string);

    let amount = queue.tracks.size > 25 ? 25 : queue.tracks.size;

    let q = queue.tracks.toArray();
    let i = 0;
    q.forEach((x) => {
      i += 1;
      embed.addFields({
        name: `${i} - ${x.title}`,
        value: `Duration: ${x.duration}`,
      });
    });

    embed.setColor("Green");

    await ctx.reply({
      embeds: [embed],
    });
  },
});
