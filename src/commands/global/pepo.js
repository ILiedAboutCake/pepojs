const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const globalImagePool = require('../../helpers/imagepool');
const rateLimitControl = require('../../helpers/ratelimts');

(async () => {
  await globalImagePool.init();
})();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pepo')
    .setDescription('Posts a picture of a frog.'),

  async execute(ctx) {
    const isLimited = await rateLimitControl.getRatelimitStatus(ctx);
    if (isLimited === undefined) {
      await ctx.interaction.reply({
        content: 'Pepo is set to ignore this channel. Mods, you can adjust with `/froglimit set`',
        ephemeral: true,
      });
      return;
    }

    if (isLimited) {
      await ctx.interaction.reply({
        content: 'Slow down! Ratelimit exceeded. Mods, you can adjust with `/froglimit set`',
        ephemeral: true,
      });
      return;
    }

    const randomFrog = await globalImagePool.get();
    const attachment = new MessageAttachment(`frogs/${randomFrog}`);

    await ctx.interaction.reply({ files: [attachment] });

    await rateLimitControl.setChannelLastUsed(ctx);
  },
};