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
import cache from "../../../core/cache";
import { Music } from "../../classes/Music";
import Handler from "../../../utils/handler";
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
    await ctx.deferReply();
    let music = cache.music.player.get(ctx.guildId as string);

    if (!music) {
      music = new Music(ctx);
      cache.music.player.set(ctx.guildId as string, music);
    }

    let check = await music.checkAvailibility(true);

    if (check) {
      return ctx.followUp({
        embeds: [new EmbedBuilder().setColor(Colors.Red).setDescription(check)],
        ephemeral: true,
      });
    }

    const queue = await music.createQueue();

    if (!queue) {
      return ctx.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription("There was an error while creating the queue."),
        ],
      });
    }

    const embed = new EmbedBuilder();

    let result = await music.search(search!);

    if (result.tracks.length === 0) {
      return ctx.followUp({
        embeds: [
          embed
            .setColor(Colors.Red)
            .setDescription("No results for that song!"),
        ],
      });
    }

    await queue.addTrack(result.tracks[0]);

    embed.setDescription(
      `**[${result.tracks[0].title}](${result.tracks[0].url})** has been added to the queue`
    );
    embed.setThumbnail(result.tracks[0].thumbnail);
    embed.setFooter({
      text: `Duration: ${result.tracks[0].duration}\nSongs in Queue: ${queue.tracks.size}`,
    });

    if (!(await music.isPlaying())) {
      await music
        .play()
        .then(async () => {
          await ctx.followUp({
            embeds: [embed],
          });
        })
        .catch(async (error) => {
          await Handler.Task("error_handler", error, ctx);
        });
    } else {
      await ctx.followUp({
        embeds: [embed],
      });
    }
  },
});
