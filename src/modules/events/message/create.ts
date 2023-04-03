import { Message } from "discord.js";
import Creator from "../../../utils/creator";
import Handler from "../../../utils/handler";

Creator.Event({
  name: "Message Create",
  id: "messageCreate",
  invoke: async (msg: Message) => {
    if (msg.author.bot) return;
    await Handler.Task("leveler", msg);
  },
});
