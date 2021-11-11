import { CommandInteraction } from "discord.js";
import winston from "winston";

module.exports = {
  name: "interactionCreate",
  execute(interaction: CommandInteraction, baseLogger: winston.Logger) {
    baseLogger.info(`interaction ${interaction.commandName} triggered`);
  },
};
