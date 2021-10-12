const config = require('../config.json');

module.exports = {
  name: 'messageCreate',
  execute(message) {
    // no bots
    if (message.author.bot) return;

    // set legacyCommands in config.json with commands to redirect
    if (config.legacyCommands.some(cmd => message.content.startsWith(cmd))) {
      console.log(`[LEGACY COMMAND] ${message.author.id} in guild ${message.guild.id} sent ${message.content}`);
      message.reply('Pepo now uses slash commands! Give `/pepo` a try');
    }
  },
};