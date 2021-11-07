import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from './config.json';
require('dotenv').config();

const runtime = process.env.RUNTIME || 'development';
const rest = new REST({ version: '9' }).setToken(config.token);

const commands: any = {
  guild: [],
  global: [],
};

for (const commandFolderScope of fs.readdirSync('./commands')) {
  const commandFiles = fs.readdirSync(`./commands/${commandFolderScope}`)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${commandFolderScope}/${file}`);
    console.log(`Registering ${commandFolderScope} slash command: ${command.data.name}`);

    // only register global commands if we are in production mode
    if (commandFolderScope === 'global' && runtime === 'production') {
      commands.global.push(command.data.toJSON());
    }
    else {
      commands.guild.push(command.data.toJSON());
    }
  }
}

rest.put(Routes.applicationGuildCommands(config.clientId, config.managementGuildId), { body: commands.guild })
  .then(() => console.log('Registered all Management Guild application commands!'))
  .catch(console.error);

if (commands.global.length > 0) {
  rest.put(Routes.applicationCommands(config.clientId), { body: commands.global })
    .then(() => console.log('Registered all Global commands!'))
    .catch(console.error);
}
else {
  console.log('No global commands registered...');
}