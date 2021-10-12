const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addfrog')
    .setDescription('Add new frog to bot lole!'),
  async execute(interaction) {
    await interaction.reply('Lole this will only pong, in the guild');
  },
};