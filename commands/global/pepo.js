const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const ImagePool = require('../../helpers/imagepool');

const frogs = new ImagePool();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pepo')
    .setDescription('Posts a picture of a frog. Wow. Amazing.'),

  async execute(interaction) {
    const randomFrog = frogs.get();
    const attachment = new MessageAttachment(`frogs/${randomFrog}`);

    await interaction.reply({ files: [attachment] });
  },
};