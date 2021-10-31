const levelup = require('levelup');
const leveldown = require('leveldown');
const config = require('../config.json');

class RateLimit {
  constructor(db) {
    this.db = db;
  }

  async get(interaction) {
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

  async set(interaction, seconds) {
    if (this.validate(seconds)) {
      await this.db.put(`${interaction.guild.id}:${interaction.channel.id}`, seconds);
      return true;
    }
    else {
      console.log('setting ratelimit failed due to validation failure :(');
      return false;
    }
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
const RateLimitControl = new RateLimit(db);
module.exports = RateLimitControl;