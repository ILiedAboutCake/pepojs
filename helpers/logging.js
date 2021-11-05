const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    // winston.format.colorize(),
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
    const childLogger = this.logger.child({
      guildID: interaction.guild.id,
      guildName: interaction.guild.name,
      channelID: interaction.channel.id,
      channelName: interaction.channel.name,
      userID: interaction.member.user.id,
      userName: interaction.member.user.tag,
      commandName: interaction.commandName,
    });
    return childLogger;
  }
}

module.exports = {
  baseLogger: logger,
  ctxLogger: ctxLogger,
};