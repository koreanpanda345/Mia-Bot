import { Message } from "discord.js";
import Creator from "../../../utils/creator";
import Handler from "../../../utils/handler";
/**
 * Handles the Message Create Event
 * Executes when a message has been sent.
 */
Creator.Event({
  name: "Message Create",
  id: "messageCreate",
  invoke: async (msg: Message) => {
    if (msg.author.bot) return;
    // Doesn't have anything to use yet.
  },
});
