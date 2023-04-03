import { Message } from "discord.js";
import cache from "../../core/cache";
import { levelCurve } from "../../utils/helpers";
import {
  createGuildConfig,
  createMember,
  updateCache,
} from "../../core/mongodb";
import Creator from "../../utils/creator";
import GuildConfigurations from "../../models/GuildConfigurations";

Creator.Task({
  name: "leveler",
  invoke: async (msg: Message) => {
    let config = cache.database.guild_configuration.get(msg.guildId as string);
    let member = cache.database.members.get(msg.author.id);

    if(!config?.modules.levels) return;
    if(!member) await createMember(msg.author.id);

    if(!member!.levels.find(x => x.guild_id === msg.guildId as string)) {
      let level = {
        guild_id: msg.guildId as string,
        level: 1,
        xp: 0,
        needed_xp: 100,
      };

      member!.levels.push(level);
      
    } else {
      let level = member!.levels.find(x => x.guild_id === msg.guildId as string);
      level!.xp += config.levels.rate.amount;
      
      if(level!.xp >= level!.needed_xp) {
        level!.level += 1;
        level!.xp = 0;
        level!.needed_xp = levelCurve(level!.level);
      }
    }
    
    await member?.save().then(async () => {
      await updateCache();
    })

  },
});
