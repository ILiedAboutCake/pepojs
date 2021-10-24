const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const globalImagePool = require('../../helpers/imagepool');

(async () => {
  await globalImagePool.init();
})();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pepo')
    .setDescription('Posts a picture of a frog. Wow. Amazing.'),

  async execute(interaction) {
    const randomFrog = await globalImagePool.get();
    const attachment = new MessageAttachment(`frogs/${randomFrog}`);

    await interaction.reply({ files: [attachment] });
  },
};