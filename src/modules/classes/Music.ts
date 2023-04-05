import { GuildQueue, Player, useMasterPlayer, useQueue } from "discord-player";
import { CommandInteraction, GuildMember } from "discord.js";
import Handler from "../../utils/handler";
import cache from "../../core/cache";
import Logger from "../../core/logger";

export class Music {
  private ctx: CommandInteraction;
  private player: Player;
  public queue: GuildQueue<unknown> | undefined;
  public member: GuildMember | undefined;
  public me: GuildMember | undefined;
  private _logger: Logger = new Logger("Music Player");
  constructor(ctx: CommandInteraction) {
    this.ctx = ctx;

    (async () => {
      this.member = await this.getMember();
      this.queue = await this.getQueue();
      this.me = await this.getMe();
    })();

    this.player = useMasterPlayer()!;
  }
  private async getMember() {
    return await this.ctx.guild?.members.fetch(this.ctx.user.id);
  }
  private async getMe() {
    return await this.ctx.guild?.members.fetchMe();
  }

  public async isUserInAChannel() {
    return (await this.getMember())!.voice.channel;
  }

  public isBotInAnotherChannel() {
    return (
      this.isBotInAVoiceChannel() &&
      this.me!.voice.channelId !== this.member!.voice.channelId
    );
  }

  public isBotInAVoiceChannel() {
    return this.me?.voice.channel;
  }

  public isBotMuted() {
    return this.me?.voice.serverMute;
  }

  public isPlaying() {
    return this.queue && this.queue.node.isPlaying();
  }

  public isPaused() {
    return this.queue && this.queue.node.isPaused();
  }

  public async search(name: string) {
    let search = await this.player.search(name, {
      searchEngine: "youtube",
    });

    return search;
  }

  public async play() {
    try {
      await this.queue?.node.play();
      return;
    } catch (error) {
      this._logger.error(error);
      return null;
    }
  }

  public async skip() {
    await this.queue?.node.skip();
    return;
  }

  public async pause() {
    await this.queue?.node.resume();
    return;
  }

  public async resume() {
    await this.queue?.node.resume();
    return;
  }

  public async destroy() {
    try {
      await this.queue?.delete();
      return;
    } catch (error) {
      this._logger.error(error);
      return null;
    }
  }

  public async createQueue() {
    if (this.queue) return this.queue;

    try {
      this.queue = this.player.nodes.create(this.ctx.guild!, {
        leaveOnEmpty: false,
        leaveOnEmptyCooldown: 60000 * 5,
        leaveOnEnd: false,
        leaveOnEndCooldown: 60000 * 5,
        leaveOnStop: false,
        skipOnNoStream: true,
        volume: 5,
      });

      await this.queue.connect(this.member?.voice.channelId!, {
        deaf: true,
      });
      cache.music.queue.set(this.ctx.guildId as string, this.queue);
      return this.queue;
    } catch (err) {
      this._logger.error(err);
      return null;
    }
  }

  public async disconnect() {
    try {
      await this.destroy();
    } catch (e) {
      await this.me?.voice.disconnect();
    } finally {
      return;
    }
  }

  public async checkAvailibility(play: boolean = false) {
    if (!(await this.isUserInAChannel()))
      return "You are not in a voice channel to use this command!";
    else if (await this.isBotInAnotherChannel())
      return "I am already in another voice channel! Please join that channel or wait until I leave!";
    else if (!(await this.isBotInAVoiceChannel()) && !play)
      return "I am not in a voice cahnne! Please let me join your channel first by using the play command!";
    else return false;
  }

  public async getQueue() {
    return cache.music.queue.get(this.ctx.guildId as string);
  }

  public getQueuedTracks() {
    return this.queue?.tracks;
  }
}
