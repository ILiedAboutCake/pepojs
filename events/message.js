const { MessageAttachment } = require('discord.js');
const config = require('../config.json');
const globalImagePool = require('../helpers/imagepool');
const rateLimitControl = require('../helpers/ratelimts');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // no bots
    if (message.author.bot) return;

    // set legacyCommands in config.json with commands to redirect
    if (config.legacyCommands.some(cmd => message.content.startsWith(cmd))) {
      console.log(`[LEGACY COMMAND] ${message.author.id} in guild ${message.guild.id} sent ${message.content}`);

      // ratelimit check
      const isLimited = await rateLimitControl.getRatelimitStatus(message);

      // workaround until message commands go away for muted channels
      if (isLimited === undefined) {
        return;
      }

      if (isLimited) {
        await message.reply('Slow down! Ratelimit exceeded. Mods, you can adjust with `/frogmod set`');
        return;
      }

      const randomFrog = await globalImagePool.get();
      const attachment = new MessageAttachment(`frogs/${randomFrog}`);

      await message.reply(
        {
          content: 'After April 2022 slash commands are required by the Discord API. Give `/pepo` a try',
          files: [attachment],
        });

      // ratelimit update
      await rateLimitControl.setChannelLastUsed(message);
    }
  },
};