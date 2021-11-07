import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('pingpepo')
    .setDescription('Ping, Pong, Pepo. Check bot health.'),
  async execute(ctx: any) {
    await ctx.interaction.reply({
      content: `Hello! I am awake and replying to requests:
      
      Latency is ${Date.now() - ctx.interaction.createdTimestamp}ms. 
      
      API Latency is ${Math.round(ctx.interaction.client.ws.ping)}ms`,
      ephemeral: true,
    });
  },
};