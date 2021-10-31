const levelup = require('levelup');
const leveldown = require('leveldown');
const memdown = require('memdown');
const config = require('../config.json');

class RateLimit {
  constructor(db, mem) {
    this.db = db;
    this.mem = mem;
  }

  async getChannelConfig(interaction) {
    try {
      const guildConfiguredRateLimit = await this.db.get(`${interaction.guild.id}:${interaction.channel.id}`, { asBuffer: false });
      console.log(`leveldb returned ratelimit of ${guildConfiguredRateLimit} seconds for key ${interaction.guild.id}:${interaction.channel.id}`);
      return parseInt(guildConfiguredRateLimit);
    }
    catch (err) {
      console.log(`leveldb lookup failure for key: ${err} defaulting to global ratelimit`);
      return config.rateLimit.default;
    }
  }

  async setChannelConfig(interaction, seconds) {
    if (this.validate(seconds)) {
      await this.db.put(`${interaction.guild.id}:${interaction.channel.id}`, seconds);
      return true;
    }
    else {
      console.log('setting ratelimit failed due to validation failure :(');
      return false;
    }
  }

  async getChannelLastUsed(interaction) {
    try {
      // get the buffer, setChannelLastUsed sets a date.utc buffer
      const channelLastUsed = await this.mem.get(`${interaction.guild.id}:${interaction.channel.id}`);
      console.log(`memdb returned ${channelLastUsed} seconds for key ${interaction.guild.id}:${interaction.channel.id}`);
      return new Date(channelLastUsed);
    }
    catch (err) {
      console.log(`memdb lookup failure for key ${err}.`);
      // return a Date object of 1/1/1970 if not found
      return new Date(null);
    }
  }

  async setChannelLastUsed(interaction) {
    const now = new Date();
    console.log(`Setting Last used to ${now} for channel ${interaction.channel.id}`);
    await this.mem.put(`${interaction.guild.id}:${interaction.channel.id}`, now);
  }

  async getRatelimitStatus(interaction) {
    const rateLimit = await this.getChannelConfig(interaction);

    if (rateLimit === 0) {
      console.log(`${interaction.channel.id} is ignored.`);
      return undefined;
    }

    const lastUsed = await this.getChannelLastUsed(interaction);
    const notBefore = new Date(lastUsed.getTime() + rateLimit * 1000);
    const now = new Date();

    console.log(`getCooldownStatus values: r:${rateLimit}, l:${lastUsed} n:${notBefore}`);

    // return true if we are in cooldown
    if (now.getTime() < notBefore.getTime()) {
      console.log(`${interaction.channel.id} is rate limited`);
      return true;
    }
    else {
      console.log(`${interaction.channel.id} is allowed to post`);
      return false;
    }
  }

  getModerationAllowed(interaction) {
    // bot owner
    if (interaction.member.id === config.managerId) return true;

    // look for matching rules from config
    const userRoles = interaction.member.permissions.toArray();
    const match = userRoles.filter(value => config.frogmodFlags.includes(value));
    console.log(`${interaction.member.id} matched ${match.length} moderation roles`);
    if (match.length > 0) return true;

    return false;
  }

  validate(seconds) {
    if (!Number.isInteger(seconds)) {
      console.log(`supplied value is not an integer ${seconds}`);
      return false;
    }

    // return true for 0 = ignore
    if (seconds === 0) {
      console.log(`Ratelimit validated at ${seconds} (ignore channel)`);
      return true;
    }

    // validate between config min
    if (seconds >= config.rateLimit.min && seconds <= config.rateLimit.max) {
      console.log(`Ratelimit validated at ${seconds} [${config.rateLimit.min} - ${config.rateLimit.max}]`);
      return true;
    }

    // failsafe
    console.log(`Unable to validate ratelimit ${seconds}`);
    return false;
  }

}

// persist this key/value store through reboots
const db = levelup(leveldown('./ratelimit.leveldb'));
const mem = levelup(memdown());
const RateLimitControl = new RateLimit(db, mem);
module.exports = RateLimitControl;