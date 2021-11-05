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
    const loggingType = interaction.inGuild();

    if (loggingType) {
      this.ctx = {
        guildID: interaction.guild.id,
        guildName: interaction.guild.name,
        channelID: interaction.channel.id,
        channelName: interaction.channel.name,
        userID: interaction.member.id,
        userName: interaction.member.user.tag,
        commandName: interaction.commandName,
      };
    }
    else {
      this.ctx = {};
    }
    return this.logger.child(this.ctx);
  }
}

module.exports = {
  baseLogger: logger,
  ctxLogger: ctxLogger,
};