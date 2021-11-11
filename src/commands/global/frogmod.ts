import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import rateLimit from "../../helpers/ratelimts";
import { Ctx } from "../../types";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("froglimit")
    .setDescription("View or configure per-channel bot cooldown.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("View current limits enforced in this channel")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription(
          "Configure this channels pepo posting cooldown (0 to mute bot)"
        )
        .addNumberOption((option) =>
          option.setName("seconds").setDescription("[0, 5 - 120] seconds")
        )
    ),

  async execute(ctx: Ctx) {
    if (!(ctx.interaction instanceof CommandInteraction)) return;

    const channel = ctx.interaction.channel;
    const channelName = channel?.type !== "DM" ? channel?.name : "";

    const userRate = ctx.interaction.options.getNumber("seconds");

    if (Number.isInteger(userRate)) {
      // does the user have server permissions a moderator would expect
      const isModerator = rateLimit.getModerationAllowed(ctx);
      if (!isModerator) {
        ctx.logger.info(
          `${ctx.interaction.member?.user.id} does not have required frogmod set permissions`
        );
        await ctx.interaction.reply({
          content:
            "You are missing permissions! Command requires `ADMINISTRATOR`, `MANAGE_GUILD`, OR `MANAGE_CHANNELS`",
          ephemeral: true,
        });
        return;
      }

      // attempt to set the new rate limit
      const rl = await rateLimit.setChannelConfig(ctx, userRate);

      // ask the db for the set ratelimit to confirm it set
      const setRate = await rateLimit.getChannelConfig(ctx);
      if (rl && setRate === userRate) {
        if (setRate === 0) {
          await ctx.interaction.reply({
            content: `${channelName} is currently ignored.`,
            ephemeral: true,
          });
        } else {
          await ctx.interaction.reply({
            content: `ratelimit set to ${setRate} seconds in ${channelName}!`,
            ephemeral: true,
          });
        }
      } else {
        await ctx.interaction.reply({
          content: `Something failed in setting ratelimit. You said ${userRate} but my database is still ${setRate}`,
          ephemeral: true,
        });
      }
    } else {
      const rl = await rateLimit.getChannelConfig(ctx);
      if (rl === 0) {
        await ctx.interaction.reply({
          content:
            "Pepo is currently ignoring this channel and will not post frogs here :(",
          ephemeral: true,
        });
      } else {
        await ctx.interaction.reply({
          content: `current ratelimit for ${channelName} is ${rl} seconds!`,
          ephemeral: true,
        });
      }
    }
  },
};
