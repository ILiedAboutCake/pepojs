export default {
  name: 'guildCreate',
  execute(guild: any, baseLogger: any) {
    // add in a little context
    const guildLogger = baseLogger.child({
      interactionType: 'guildCreate',
      guildID: guild.id,
      guildName: guild.name,
    });

    guildLogger.warn('Joined guild');
  },
};