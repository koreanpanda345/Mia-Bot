import client from "./core/client";
import { runMongoose } from "./core/mongodb";
import loadFolder from "./utils/loader";

require("dotenv").config();

(async () => {
  await loadFolder("commands");
  await loadFolder("monitors");
  await loadFolder("tasks");
  await loadFolder("events");

  await runMongoose();
  client.login(process.env.DISCORD_BOT_TOKEN);
})();
