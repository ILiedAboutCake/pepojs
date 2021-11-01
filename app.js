const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  shards: 'auto',
});

// register events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    console.log(`Registering Once Event: ${event.name}`);
    client.once(event.name, (...args) => event.execute(...args));
  }
  else {
    console.log(`Registering Reusable Event: ${event.name}`);
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// register commands, loop through scope folders and load all commands
client.commands = new Collection();
for (const commandFolderScope of fs.readdirSync('./commands')) {
  const commandFiles = fs.readdirSync(`./commands/${commandFolderScope}`).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${commandFolderScope}/${file}`);
    console.log(`Registering ${commandFolderScope} slash command: ${command.data.name}`);
    client.commands.set(command.data.name, command);
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    console.log(`Attempting to execute command ${interaction.commandName}`);
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
  }
});

process.on('unhandledRejection', err => {
  console.log('uncaught exception:', err);
});

client.login(config.token);