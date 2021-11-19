module.exports = {
  name: 'ready',
  once: true,
  execute(client, baseLogger) {
    baseLogger.info(`Logged into Discord gateway as ${client.user.id}`);

    client.user.setActivity('@pepo | /pepo | /pepohelp');
  },
};