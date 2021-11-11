import { SlashCommandBuilder } from "@discordjs/builders";
import { Ctx } from "../../types";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pingpepo")
    .setDescription("Ping, Pong, Pepo. Check bot health."),
  async execute(ctx: Ctx) {
    await ctx.interaction.reply({
      content: `Hello! I am awake and replying to requests:
      
      Latency is ${Date.now() - ctx.interaction.createdTimestamp}ms. 
      
      API Latency is ${Math.round(ctx.interaction.client.ws.ping)}ms`,
      ephemeral: true,
    });
  },
};
