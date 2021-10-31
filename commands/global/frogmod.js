const { SlashCommandBuilder } = require('@discordjs/builders');
const rateLimit = require('../../helpers/ratelimts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('froglimit')
    .setDescription('View or configure per-channel bot cooldown.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('View current limits enforced in this channel'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Configure this channels pepo posting cooldown (0 to mute bot)')
        .addNumberOption(option => option.setName('seconds').setDescription('[0, 5 - 120] seconds'))),

  async execute(interaction) {
    const userRate = interaction.options.getNumber('seconds');

    if (Number.isInteger(userRate)) {
      // attempt to set the new rate limit
      const rl = await rateLimit.setChannelConfig(interaction, userRate);

      // ask the db for the set ratelimit to confirm it set
      const setRate = await rateLimit.getChannelConfig(interaction);
      if (rl && setRate === userRate) {
        if (setRate === 0) {
          interaction.reply({
            content: `${interaction.channel.name} is currently ignored.`,
            ephemeral: true,
          });
        }
        else {
          interaction.reply({
            content: `ratelimit set to ${setRate} seconds in ${interaction.channel.name}!`,
            ephemeral: true,
          });
        }
      }
      else {
        interaction.reply({
          content: `Something failed in setting ratelimit. You said ${userRate} but my database is still ${setRate}`,
          ephemeral: true,
        });
      }
    }
    else {
      const rl = await rateLimit.getChannelConfig(interaction);
      if (rl === 0) {
        interaction.reply({
          content: 'Pepo is currently ignoring this channel and will not post frogs here :(',
          ephemeral: true,
        });
      }
      else {
        interaction.reply({
          content: `current ratelimit for ${interaction.channel.name} is ${rl} seconds!`,
          ephemeral: true,
        });
      }

    }
  },
};