export default {
  name: 'interactionCreate',
  execute(interaction: any, baseLogger: any) {
    baseLogger.info(`interaction ${interaction.commandName} triggered`);
  },
};