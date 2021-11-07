export default {
  name: 'guildDelete',
  execute(guild: any, baseLogger: any) {
    // add in a little context
    const guildLogger = baseLogger.child({
      interactionType: 'guildDelete',
      guildID: guild.id,
      guildName: guild.name,
    });

    guildLogger.warn('Left guild');
  },
};