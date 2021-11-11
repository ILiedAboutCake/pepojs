const { SlashCommandBuilder } = require('@discordjs/builders');
const { pipeline } = require('stream/promises');
const axios = require('axios').default;
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const globalImagePool = require('../../helpers/imagepool');
const config = require('../../config.json');

// hash + filename validation
const reg = new RegExp('^[0-9a-f]{40}\\.(png|jpg|gif)$');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('frogmod')
    .setDescription('Add or Remove frogs from bot')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a new frog via URL')
        .addStringOption(option => option.setName('url').setDescription('Discord CDN or Plain Image URL')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a frog')
        .addStringOption(option => option.setName('name').setDescription('Filename (SHA256Sum)'))),

  async execute(ctx) {
    // only let bot admin do this
    if (!ctx.interaction.user.id === config.managerId) return;

    const url = ctx.interaction.options.getString('url');
    const filename = ctx.interaction.options.getString('name');

    if (url) {
      ctx.logger.info(`attempting to add new frog from ${url}`);

      // prepare to download file, get fs location
      const fileNameTemp = path.parse(url).base;
      const tempPath = path.resolve(__dirname, '../../frogs/_temp', fileNameTemp);
      const writer = fs.createWriteStream(tempPath);

      // grab the frog, stream it to disk in a temp folder
      const rsp = await axios.request({ url, method: 'GET', responseType: 'stream' })
        .catch((err) => console.log(err));
      await pipeline(rsp.data, writer);

      // pull the temp file from fs
      const tempFileBuffer = await fs.promises.readFile(tempPath);
      ctx.logger.info(`attempting to write frog to disk as temp file ${tempPath}`);

      // remove the temp file from fs
      await fs.promises.rm(tempPath);

      // get sha1 hash
      const hashSum = crypto.createHash('sha1');
      hashSum.update(tempFileBuffer);
      const frogHash = hashSum.digest('hex');
      const frogExtension = path.extname(tempPath);
      const frogFileName = `${frogHash}${frogExtension}`;

      // validate the name of new frog
      if (!reg.test(frogFileName)) {
        await ctx.interaction.reply(`${frogFileName} Does not pass validation, skipping. (check console)`);
        ctx.logger.warn(`${frogFileName} failed validation`);
        return;
      }

      // get the frogs directory
      const existingFrogs = await fs.promises.readdir(path.resolve(__dirname, '../../frogs'));
      ctx.logger.info(`Checking if ${frogFileName} already exists on disk`);

      if (existingFrogs.includes(frogFileName)) {
        ctx.logger.info(`${frogFileName} Already exists, will not be added to disk`);
        await ctx.interaction.reply(`${frogFileName} Already exists, ignoring`);
      }
      else {
        ctx.logger.info(`${frogFileName} is new, writing temp buffer to disk`);
        const frogAcceptedPath = path.resolve(__dirname, '../../frogs', frogFileName);
        await fs.promises.writeFile(frogAcceptedPath, tempFileBuffer);

        // new frog, invalidate cache to include it
        await globalImagePool.reset();

        await ctx.interaction.reply(`${frogFileName} Accepted to the PepoDB!`);
      }
    }

    if (filename) {
      // although only the bot owner can run this command, regex to look for sha1+extension
      if (!reg.test(filename)) {
        await ctx.interaction.reply(`${filename} Does not validate safety checks. Sussy baka.`);
        ctx.logger.warn(`${filename} failed to verify as safe file path`);
        return;
      }

      const frogPath = path.resolve(__dirname, '../../frogs', filename);
      ctx.logger.warn(`attempting to remove frog ${frogPath}`);

      // try to nuke the file
      try {
        await fs.promises.rm(frogPath);
      }
      catch (err) {
        await ctx.interaction.reply(`${frogPath} Not found on disk`);
        ctx.logger.warn(err, frogPath);
        return;
      }

      // reset the cache to keep a dead frog from being seen (monkas)
      await globalImagePool.reset();

      // pass along to the caller the deletion worked
      await ctx.interaction.reply(`${frogPath} Removed!`);

    }
  },
};