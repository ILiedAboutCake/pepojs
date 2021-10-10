const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pepoping')
    .setDescription('ping, pong, poggers.'),
  async execute(interaction) {
    await interaction.reply('pong, lole loser');
  },
};