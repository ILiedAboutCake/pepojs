const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pingpepo')
    .setDescription('Ping, Pong, Pepo. Check bot health.'),
  async execute(interaction) {
    await interaction.reply({
      content: `Hello! I am awake and replying to requests:
      
      Latency is ${Date.now() - interaction.createdTimestamp}ms. 
      
      API Latency is ${Math.round(interaction.client.ws.ping)}ms`,
      ephemeral: true,
    });
  },
};