const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const logger = require('./helpers/logging');

const baseLogger = logger.baseLogger;
const contextLogger = new logger.ctxLogger(baseLogger);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  shards: 'auto',
});

// register events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    baseLogger.info(`Registering Once Event: ${event.name}`);
    client.once(event.name, (...args) => event.execute(...args, baseLogger));
  }
  else {
    baseLogger.info(`Registering Reusable Event: ${event.name}`);
    client.on(event.name, (...args) => {
      // const ctxLogger = contextLogger.addContextLogger(...args);
      event.execute(...args, baseLogger);
    });
  }
}

// register commands, loop through scope folders and load all commands
client.commands = new Collection();
for (const commandFolderScope of fs.readdirSync('./commands')) {
  const commandFiles = fs.readdirSync(`./commands/${commandFolderScope}`).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${commandFolderScope}/${file}`);
    baseLogger.info(`Registering ${commandFolderScope} slash command: ${command.data.name}`);
    client.commands.set(command.data.name, command);
  }
}

client.on('interactionCreate', async interaction => {
  // build context
  const ctx = {
    interaction: interaction,
    logger: contextLogger.addContextLogger(interaction),
  };

  if (!ctx.interaction.isCommand()) return;

  const command = client.commands.get(ctx.interaction.commandName);

  if (!command) return;

  try {
    ctx.logger.info(`Attempting to execute command ${ctx.interaction.commandName}`);
    await command.execute(ctx);
  }
  catch (error) {
    console.error(error);
  }
});

process.on('unhandledRejection', err => {
  console.log('uncaught exception:', err);
});

client.login(config.token);