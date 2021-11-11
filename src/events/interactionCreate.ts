import { CommandInteraction } from "discord.js";
import winston from "winston";

export default {
  name: "interactionCreate",
  execute(interaction: CommandInteraction, baseLogger: winston.Logger) {
    baseLogger.info(`interaction ${interaction.commandName} triggered`);
  },
};
