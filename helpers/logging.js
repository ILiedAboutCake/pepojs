const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'pepojs' },
  transports: [
    new winston.transports.Console(),
  ],
});

class ctxLogger {
  constructor(parentLogger) {
    this.logger = parentLogger;
  }

  addContextLogger(interaction) {
    if (interaction.constructor.name === 'Message') {
      this.ctx = {
        interactionType: 'Message',
        guildID: interaction.guild.id,
        guildName: interaction.guild.name,
        channelID: interaction.channel.id,
        channelName: interaction.channel.name,
        userID: interaction.author.id,
        userName: interaction.author.username,
        commandName: 'Legacy',
      };
    }
    else if (interaction.constructor.name === 'CommandInteraction') {
      this.ctx = {
        interactionType: 'CommandInteraction',
        guildID: interaction.guild.id,
        guildName: interaction.guild.name,
        channelID: interaction.channel.id,
        channelName: interaction.channel.name,
        userID: interaction.user.id,
        userName: interaction.user.username,
        commandName: interaction.commandName,
      };
    }
    else {
      this.ctx = {
        interactionType: 'Unknown',
      };
    }
    return this.logger.child(this.ctx);
  }
}

module.exports = {
  baseLogger: logger,
  ctxLogger: ctxLogger,
};