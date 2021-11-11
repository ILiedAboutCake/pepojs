const config = require('../config.json');
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransport = new ElasticsearchTransport({
  level: 'info',
  indexPrefix: 'pepojs',
  clientOpts: {
    node: config.elasticServer,
  },
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'pepojs' },
  transports: [
    new winston.transports.Console(),
    esTransport,
  ],
});

class ctxLogger {
  constructor(parentLogger) {
    this.logger = parentLogger;
  }

  addContextLogger(interaction) {
    // sometimes unhealthy guilds dont send a guild ???? discord at scale sux
    if (!interaction.guild) {
      return this.logger.child({
        interactionType: 'MessagePartial',
        clientID: interaction.client.user.id,
      });
    }

    if (interaction.constructor.name === 'Message') {
      this.ctx = {
        interactionType: 'Message',
        clientID: interaction.client.user.id,
        guildID: interaction.guild.id,
        guildName: interaction.guild.name,
        channelID: interaction.channel.id,
        channelName: interaction.channel.name,
        userID: interaction.author.id,
        userName: interaction.author.username,
        messageContent: interaction.content,
        commandName: 'Legacy',
      };
    }
    else if (interaction.constructor.name === 'CommandInteraction') {
      this.ctx = {
        interactionType: 'CommandInteraction',
        clientID: interaction.client.user.id,
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
        clientID: interaction.client.user.id,
      };
    }
    return this.logger.child(this.ctx);
  }
}

module.exports = {
  baseLogger: logger,
  ctxLogger: ctxLogger,
};