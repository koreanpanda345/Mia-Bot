import {
  Colors,
  EmbedBuilder,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import Creator from "../../../utils/creator";
import client from "../../../core/client";
import { YouTubeExtractor } from "@discord-player/extractor";
import { useMasterPlayer, useQueue } from "discord-player";
let data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays music in a voice channel from youtube")
  .addStringOption((option) => {
    option.setName("search");
    option.setDescription("The url to the music video.");
    option.setRequired(true);
    return option;
  });
Creator.Command({
  data,

  invoke: async (ctx, args) => {
    let search = args.getString("search");
    let channel = (await ctx.guild?.members.fetch(ctx.member!.user.id))?.voice
      .channel;

    if (!channel) {
      await ctx.reply(
        "You must be in a voice channel before using this command"
      );
      return;
    }

    if (!((await ctx.guild?.members.fetchMe())!.voice.channel === channel)) {
      await ctx.reply(
        "It seems like someone is already using me. Please wait your turn, or join the same vc as me and queue some tracks ^-^"
      );
      return;
    }

    await ctx.deferReply();

    try {
      const player = useMasterPlayer();
      if (!player) return;

      const query = await player!.search(search as string, {
        searchEngine: "youtube",
      });
      let queue = useQueue(ctx.guild?.id as string);

      if (!queue) {
        const { track } = await player!.play(channel, query, {
          nodeOptions: {
            metadata: ctx,
          },
        });
        let queue = useQueue(ctx.guild?.id as string);
        queue?.node.setVolume(5);
        let embed = new EmbedBuilder();
        embed.setTitle(`Added To Queue`);
        embed.setDescription(
          `**${query.tracks[0].title}**\nYoutube Channel: ${query.tracks[0].author}\nDuration: ${query.tracks[0].duration}`
        );
        embed.setImage(query.tracks[0].thumbnail);
        embed.setColor(Colors.Green);

        return ctx.followUp({
          embeds: [embed],
        });
      } else {
        queue.addTrack(query.tracks[0]);
        let embed = new EmbedBuilder();
        embed.setTitle(`Added To Queue`);
        embed.setDescription(
          `**${query.tracks[0].title}**\nYoutube Channel: ${query.tracks[0].author}\nDuration: ${query.tracks[0].duration}`
        );
        embed.setImage(query.tracks[0].thumbnail);
        embed.setColor(Colors.Green);
        return ctx.followUp({ embeds: [embed] });
      }
    } catch (err) {
      return ctx.followUp(`Something went wrong: ${err}`);
    }
  },
});
