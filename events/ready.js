module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged into Discord gateway as ${client.user.id}`);

    client.user.setActivity('/pepo');
  },
};