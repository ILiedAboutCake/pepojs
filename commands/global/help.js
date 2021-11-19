const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json');

const supportText = `
Frogbot 3 "Pepo". Built and maintained with love by Cake#0001 <https://cake.sh>

**Mention Support:**
Due to the Discord API changes, after April 2022 you can no longer use ! commands to access a bot.
To work around this you must mention me <@${config.clientId}> to get a reply, OR use Discord slash commands.

**Slash Commands:**
\`/pepo\`: Post a frog
\`/getpepo\`: Get the Discord invite URL for this bot
\`/pingpepo\`: Check if Pepo is awake and feels like chatting :)
\`/froglimit get\`: Get the rate limit or ignored status for the current channel

**Moderation Commands:**
\`/froglimit set 0, [${config.rateLimit.min} - ${config.rateLimit.max}]\` seconds
Set to 0 to ignore the channel. Default ratelimit is ${config.rateLimit.default} seconds
Setting ratelimit requires one of the following permissions: \`${config.frogmodFlags}\`

Frogbot is designed with joy in mind. Suggestions for new images can be submitted in the Pepo support Discord.
Additionally, if you believe a frog should be removed, please reach out.

Looking for better moderation tools? Check out my other project, Bernard. <https://getbernard.io>

**Support Server:** ${config.supportInvite}
`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pepohelp')
    .setDescription('Have a new frog to suggest? Think one should be removed? Can\'t remember the commands?'),
  async execute(ctx) {
    await ctx.interaction.reply({
      content: supportText,
      ephemeral: true,
    });
  },
};