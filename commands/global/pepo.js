const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pepo')
    .setDescription('Posts a very poggers random pepo image!'),


  async execute(interaction) {
    await interaction.reply('pong, lole loser');
  },
};