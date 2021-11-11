import { Guild } from "discord.js";
import winston from "winston";

export default {
  name: "guildDelete",
  execute(guild: Guild, baseLogger: winston.Logger) {
    // add in a little context
    const guildLogger = baseLogger.child({
      interactionType: "guildDelete",
      guildID: guild.id,
      guildName: guild.name,
    });

    guildLogger.warn("Left guild");
  },
};
