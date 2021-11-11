import { GuildMember } from "discord.js";
import leveldown from "leveldown";
import levelup from "levelup";
import memdown from "memdown";
import winston from "winston";
import config from "../config";
import { Ctx } from "../types";
import { logger as baseLogger } from "./logging";

class RateLimit {
  db: any;
  mem: any;
  logger: winston.Logger;

  constructor(db: any, mem: any) {
    this.db = db;
    this.mem = mem;
    this.logger = baseLogger;
  }

  async getChannelConfig(ctx: any) {
    try {
      const guildConfiguredRateLimit = await this.db.get(
        `${ctx.interaction.guild.id}:${ctx.interaction.channel.id}`,
        { asBuffer: false }
      );
      ctx.logger.info(
        `leveldb returned ratelimit of ${guildConfiguredRateLimit}`
      );
      return parseInt(guildConfiguredRateLimit);
    } catch (err) {
      ctx.logger.info(
        `leveldb lookup failure for key: ${err} defaulting to global ratelimit`
      );
      return config.rateLimit.default;
    }
  }

  async setChannelConfig(ctx: any, seconds: number | null) {
    if (this.validate(seconds)) {
      ctx.logger.info(`ratelimit set to ${seconds}`);
      await this.db.put(
        `${ctx.interaction.guild.id}:${ctx.interaction.channel.id}`,
        seconds
      );
      return true;
    } else {
      ctx.logger.warn("setting ratelimit failed due to validation failure :(");
      return false;
    }
  }

  async getChannelLastUsed(ctx: any) {
    try {
      // get the buffer, setChannelLastUsed sets a date.utc buffer
      const channelLastUsed = await this.mem.get(
        `${ctx.interaction.guild.id}:${ctx.interaction.channel.id}`
      );
      ctx.logger.info(`memdb returned ${channelLastUsed} seconds`);
      return new Date(channelLastUsed);
    } catch (err) {
      ctx.logger.warn(`memdb lookup failure for key ${err}.`);
      // return a Date object of 1/1/1970 if not found
      return new Date();
    }
  }

  async setChannelLastUsed(ctx: Ctx) {
    const now = new Date();
    ctx.logger.info(`Setting Last used to ${now}`);
    await this.mem.put(
      `${ctx.interaction.guild?.id}:${ctx.interaction.channel?.id}`,
      now
    );
  }

  async getRatelimitStatus(ctx: Ctx) {
    const rateLimit = await this.getChannelConfig(ctx);

    if (rateLimit === 0) {
      ctx.logger.warn("channel ignored.");
      return undefined;
    }

    const lastUsed = await this.getChannelLastUsed(ctx);
    const notBefore = new Date(lastUsed.getTime() + rateLimit * 1000);
    const now = new Date();

    ctx.logger.info(
      `getCooldownStatus values: r:${rateLimit}, l:${lastUsed} n:${notBefore}`
    );

    // return true if we are in cooldown
    if (now.getTime() < notBefore.getTime()) {
      ctx.logger.warn("rate limited");
      return true;
    } else {
      ctx.logger.info("allowed to post");
      return false;
    }
  }

  getModerationAllowed(ctx: Ctx) {
    // bot owner
    if (ctx.interaction.member?.user.id === config.managerId) return true;

    const member = ctx.interaction.member;
    if (!(member instanceof GuildMember)) return false;

    // look for matching rules from config
    const userRoles = member.permissions.toArray();
    const match =
      userRoles?.filter((value) => config.frogmodFlags.includes(value)) || [];

    ctx.logger.info(`${member.id} matched ${match.length} moderation roles`);

    if (match.length > 0) return true;

    return false;
  }

  validate(seconds: any) {
    if (!Number.isInteger(seconds)) {
      this.logger.info(`supplied value is not an integer ${seconds}`);
      return false;
    }

    // return true for 0 = ignore
    if (seconds === 0) {
      this.logger.info(`Ratelimit validated at ${seconds} (ignore channel)`);
      return true;
    }

    // validate between config min
    if (seconds >= config.rateLimit.min && seconds <= config.rateLimit.max) {
      this.logger.info(
        `Ratelimit validated at ${seconds} [${config.rateLimit.min} - ${config.rateLimit.max}]`
      );
      return true;
    }

    // failsafe
    this.logger.info(`Unable to validate ratelimit ${seconds}`);
    return false;
  }
}

// persist this key/value store through reboots
const db = levelup(leveldown("./ratelimit.leveldb"));
const mem = levelup(memdown());
const RateLimitControl = new RateLimit(db, mem);
export default RateLimitControl;
