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
    .setDescription('Posts a picture of a frog. Wow. Amazing.'),

  async execute(interaction) {
    const isLimited = await rateLimitControl.getRatelimitStatus(interaction);
    if (isLimited === undefined) {
      await interaction.reply({
        content: 'Pepo is set to ignore this channel. Mods, you can adjust with `/frogmod set`',
        ephemeral: true,
      });
      return;
    }

    if (isLimited) {
      await interaction.reply({
        content: 'Slow down! Ratelimit exceeded. Mods, you can adjust with `/frogmod set`',
        ephemeral: true,
      });
      return;
    }

    const randomFrog = await globalImagePool.get();
    const attachment = new MessageAttachment(`frogs/${randomFrog}`);

    await interaction.reply({ files: [attachment] });

    await rateLimitControl.setChannelLastUsed(interaction);
  },
};