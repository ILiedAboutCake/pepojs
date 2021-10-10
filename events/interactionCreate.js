module.exports = {
  name: 'interactionCreate',
  execute(interaction) {
    console.log(`${interaction.user.id} in guild ${interaction.guild.name} triggered an interaction`);
  },
};