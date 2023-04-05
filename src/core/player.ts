import { Player } from "discord-player";
import client from "./client";
import Logger from "./logger";
import { Colors, EmbedBuilder } from "discord.js";

const player = new Player(client, {
  smoothVolume: true,
});
const logger = new Logger("Music Player");

player.events.on("playerError", (queue, error, track) => {
  queue.channel?.send(`Error: ${error}`);
});
player.events.on("playerStart", (queue, track) => {
  let embed = new EmbedBuilder();

  embed.setTitle(`Now Playing ${track.title}`);
  embed.setImage(track.thumbnail);
  embed.setColor(Colors.Red);
  console.log(queue.channel);
  queue.channel?.send({
    embeds: [embed],
  });
});
player.events.on("playerTrigger", (queue, track) => {
  logger.debug("Triggered");
});
player.events.on("playerFinish", (queue, track) => {
  if (queue.isEmpty()) queue.dispatcher?.disconnect();
});
player.events.on("emptyQueue", (queue) => {
  queue.dispatcher?.disconnect();
});
