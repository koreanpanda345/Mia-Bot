import { connect } from "mongoose";
import GuildConfigurations from "../models/GuildConfigurations";
import cache from "./cache";
import Users from "../models/Users";
import { Collection } from "discord.js";

export async function runMongoose() {
  await connect(process.env.MONGO_CONNECT as string, {});

  await updateCache();
}

export async function createUser(userId: string) {
  const newUser = new Users({
    user_id: userId,
    music: {
      playlist: []
    }
  });

  await newUser.save();
  await updateCache();
  return newUser;
}

export async function createGuildConfig(guildId: string) {
  const newConfig = new GuildConfigurations({
    guild_id: guildId,
    modules: {
      auto_roles: false,
      levels: false,
      logs: false,
      moderation: false,
      ranks: false,
      verify: false,
      welcome: false,
    },
  });

  await newConfig.save();
  await updateCache();
  return newConfig;
}

export async function updateCache() {
  setTimeout(async () => {
    await getConfig();
    await getUser();
  }, 500);
}

async function getConfig() {
  const configs = await GuildConfigurations.find();
  configs.forEach((x) => {
    cache.database.guild_configuration.set(x.guild_id, x);
  });
}

async function getUser() {
  const users = await Users.find();

  users.forEach((x) => {
    cache.database.users.set(x.user_id, x);
  });
}
