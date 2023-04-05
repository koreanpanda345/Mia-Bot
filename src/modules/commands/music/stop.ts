import { SlashCommandBuilder } from "discord.js";
import Creator from "../../../utils/creator";
import { useMasterPlayer, useQueue } from "discord-player";
let data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription(
    "Stops the music player and makes the bot leave the voice channel."
  );
Creator.Command({
  data,

  invoke: async (ctx, args) => {
	await ctx.deferReply();
	try {
		let player = useMasterPlayer();
		if(!player) return;

		let queue = useQueue(ctx.guild?.id as string);

		if(!queue) return ctx.followUp("There is no song playing");

		queue.delete();

		return ctx.followUp("The song has stopped and the queue is cleared! I am now leaving!");
	}catch(err) {

	}
  },
});
