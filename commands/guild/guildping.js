const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guildping')
    .setDescription('Mod only guild ping command'),
  async execute(interaction) {
    await interaction.reply('Lole this will only pong, in the guild');
  },
};