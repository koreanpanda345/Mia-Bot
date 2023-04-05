import { GuildQueue, Player, useMasterPlayer, useQueue } from "discord-player";
import { CommandInteraction } from "discord.js";
import Handler from "../../utils/handler";

export class Music {
  private ctx: CommandInteraction;
  private player: Player;
  public queue: GuildQueue<unknown> | null = null;
  constructor(ctx: CommandInteraction) {
    this.ctx = ctx;
    (async () => {
      this.queue = await this.getQueue();
    })();
    this.player = useMasterPlayer()!;
  }

  public isYoutubeLink(target: string) {
    const url = new URL(target);
    return url.hostname === "www.youtube.com" || url.hostname === "youtu.be";
  }

  public async isBotMuted() {
    const me = await this.ctx.guild?.members.fetchMe();
    return me?.voice.serverMute;
  }

  public async isUserInChannel() {
    const member = await this.ctx.guild?.members.fetch(this.ctx.user.id);
    return member?.voice.channel;
  }

  public async isBotInAnotherChannel() {
    const me = await this.ctx.guild?.members.fetchMe();
    const member = await this.ctx.guild?.members.fetch(this.ctx.user.id);

    return me?.voice.channel && me.voice.channelId !== member?.voice.channelId;
  }

  public async isBotInAVoiceChannel() {
    const me = await this.ctx.guild?.members.fetchMe();
    return me?.voice.channel;
  }

  public isPlaying() {
    return this.queue && this.queue.node.isPlaying();
  }

  public isPaused() {
    return this.queue && this.queue.node.isPaused();
  }

  public async search(name: string) {
    let result = await this.player.search(name, {
      searchEngine: "youtube",
    });

    return result;
  }

  public async play() {
    try {
      await this.queue?.node.play();
    } catch (error) {
      await Handler.Task("error_handler", error, this.ctx);
    }
  }

  public async skip() {
    await this.queue?.node.skip();
  }

  public async pause() {
    await this.queue?.node.pause();
  }

  public async resume() {
    await this.queue?.node.resume();
  }

  public async destroy() {
    try {
      await this.queue?.delete();
    } catch (error) {
      await Handler.Task("error_handler", error, this.ctx);
    }
  }

  public async getQueue() {
    return useQueue(this.ctx.guildId as string);
  }

  public async createQueue() {
    if (this.queue) return this.queue;

    try {
      this.queue = this.player.nodes.create(this.ctx.guildId!, {
        metadata: {
          channel: this.ctx.channel,
          requestedBy: this.ctx.user,
        },
        leaveOnEmpty: false,
        leaveOnEndCooldown: 60000 * 5,
        leaveOnEnd: false,
        leaveOnEmptyCooldown: 60000 * 5,
        leaveOnStop: false,
        skipOnNoStream: true,
        volume: 5,
      });
      let member = await this.ctx.guild?.members.fetch(this.ctx.user.id);
      await this.queue.connect(member!.voice.channelId!, {
        deaf: true,
      });

      return this.queue;
    } catch (error) {
      await Handler.Task("error_handler", error, this.ctx);
      return false;
    }
  }

  public async disconnect() {
    try {
      this.destroy();
    } catch (error) {
      let me = await this.ctx.guild?.members.fetchMe();
      await me?.voice.disconnect();
    }
  }

  public async checkAvailibility(play: boolean = false) {
    if (!(await this.isUserInChannel()))
      return "You are not in a voice channel to use this command!";
    else if (await this.isBotInAnotherChannel())
      return "I am already in another voice channel! Please join that channel or wait until I leave!";
    else if (!(await this.isBotInAVoiceChannel()) && !play)
      return "I am not in a voice channel! Please let me join your channel first by using the play command!";
    else return false;
  }

  public getQueuedTracks() {
    return this.queue?.tracks;
  }
}
