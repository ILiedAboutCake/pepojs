module.exports = {
  name: 'interactionCreate',
  execute(interaction, baseLogger) {
    baseLogger.info(`interaction ${interaction.commandName} triggered`);
  },
};