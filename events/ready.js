module.exports = {
  name: 'ready',
  once: true,
  execute(client, logger) {
    logger.info(`Logged into Discord gateway as ${client.user.id}`);

    client.user.setActivity('/pepo');
  },
};