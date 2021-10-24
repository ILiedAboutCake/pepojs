const { MessageAttachment } = require('discord.js');
const config = require('../config.json');
const globalImagePool = require('../helpers/imagepool');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // no bots
    if (message.author.bot) return;

    // set legacyCommands in config.json with commands to redirect
    if (config.legacyCommands.some(cmd => message.content.startsWith(cmd))) {
      console.log(`[LEGACY COMMAND] ${message.author.id} in guild ${message.guild.id} sent ${message.content}`);

      const randomFrog = await globalImagePool.get();
      const attachment = new MessageAttachment(`frogs/${randomFrog}`);

      await message.reply(
        {
          content: 'After April 2022 slash commands are required by the Discord API. Give `/pepo` a try',
          files: [attachment],
        });
    }
  },
};