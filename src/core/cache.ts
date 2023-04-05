import { Collection } from "discord.js";
import { EventType } from "../types/EventType";
import { MonitorType } from "../types/MonitorType";
import { CommandType } from "../types/CommandType";
import { TaskType } from "../types/TaskType";
import { Document, Types } from "mongoose";
import { IGuildConfiguration } from "../models/GuildConfigurations";
import { IUser } from "../models/Users";
import { GuildQueue } from "discord-player";
import { Music } from "../modules/classes/Music";

const cache = {
  /**
   * Contains all of the caching related to the bot
   */
  bot: {
    commands: new Collection<string, CommandType>(),
    events: new Collection<string, EventType>(),
    monitors: new Collection<string, MonitorType>(),
    tasks: new Collection<string, TaskType>(),
  },
  /**
   * Contains all of the caching related to the database
   */
  database: {
    guild_configuration: new Collection<
      string,
      Document<unknown, any, IGuildConfiguration> &
        IGuildConfiguration & {
          _id: Types.ObjectId;
        }
    >(),
    users: new Collection<
      string,
      Document<unknown, any, IUser> &
        IUser & {
          _id: Types.ObjectId;
        }
    >(),
  },
  /**
   * Contains all of the caching related to the music player.
   */
  music: {
    queue: new Collection<string, GuildQueue<unknown>>(),
    player: new Collection<string, Music>(),
  },
};

export default cache;
