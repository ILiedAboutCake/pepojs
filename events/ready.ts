export default {
  name: 'ready',
  once: true,
  execute(client: any, baseLogger: any) {
    baseLogger.info(`Logged into Discord gateway as ${client.user.id}`);

    client.user.setActivity('/pepo | /getpepo');
  },
};