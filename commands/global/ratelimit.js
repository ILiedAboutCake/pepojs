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
        .addNumberOption(option => option.setName('seconds').setDescription('[0 - 120] seconds'))),

  async execute(interaction) {
    const userRate = interaction.options.getNumber('seconds');

    if (Number.isInteger(userRate)) {
      // attempt to set the new rate limit
      const rl = await rateLimit.set(interaction, userRate);

      // ask the db for the set ratelimit to confirm it set
      const setRate = await rateLimit.get(interaction);
      if (rl && setRate === userRate) {
        if (setRate === 0) {
          interaction.reply(`${interaction.channel.name} is currently ignored.`);
        }
        else {
          interaction.reply(`ratelimit set to ${setRate} seconds in ${interaction.channel.name}!`);
        }
      }
      else {
        interaction.reply(`Something failed in setting ratelimit. You said ${userRate} but my database is still ${setRate}`);
      }
    }
    else {
      const rl = await rateLimit.get(interaction);
      if (rl === 0) {
        interaction.reply('Pepo is currently ignoring this channel and will not post frogs here :(');
      }
      else {
        interaction.reply(`current ratelimit for ${interaction.channel.name} is ${rl} seconds!`);
      }

    }
  },
};