import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageAttachment } from 'discord.js';
import globalImagePool from '../../helpers/imagepool';
import rateLimitControl from '../../helpers/ratelimts';

(async () => {
  await globalImagePool.init();
})();

export default {
  data: new SlashCommandBuilder()
    .setName('pepo')
    .setDescription('Posts a picture of a frog.'),

  async execute(ctx: any) {
    const isLimited = await rateLimitControl.getRatelimitStatus(ctx);
    if (isLimited === undefined) {
      await ctx.interaction.reply({
        content: 'Pepo is set to ignore this channel. Mods, you can adjust with `/froglimit set`',
        ephemeral: true,
      });
      return;
    }

    if (isLimited) {
      await ctx.interaction.reply({
        content: 'Slow down! Ratelimit exceeded. Mods, you can adjust with `/froglimit set`',
        ephemeral: true,
      });
      return;
    }

    const randomFrog = await globalImagePool.get();
    const attachment = new MessageAttachment(`frogs/${randomFrog}`);

    await ctx.interaction.reply({ files: [attachment] });

    await rateLimitControl.setChannelLastUsed(ctx);
  },
};