import { Guild } from "discord.js";
import winston from "winston";

module.exports = {
  name: "guildCreate",
  execute(guild: Guild, baseLogger: winston.Logger) {
    // add in a little context
    const guildLogger = baseLogger.child({
      interactionType: "guildCreate",
      guildID: guild.id,
      guildName: guild.name,
    });

    guildLogger.warn("Joined guild");
  },
};
