import { Collection, Intents } from "discord.js";
import fs from "fs";
import path from "path";
import config from "./config";
import { ctxLogger, logger } from "./helpers/logging";
import { PepoClient } from "./types/PepoClient";

const baseLogger = logger;
const contextLogger = new ctxLogger(baseLogger);

baseLogger.info(
  "PepoJS Init. Attempting to start, no promise I will work but sure can try :)"
);

const client = new PepoClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  shards: "auto",
});

const eventsPath = path.join(__dirname, "../dist/events");

// register events
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    baseLogger.info(`Registering Once Event: ${event.name}`);
    client.once(event.name, (args) => event.execute(args, baseLogger));
  } else {
    baseLogger.info(`Registering Reusable Event: ${event.name}`);
    client.on(event.name, (args) => {
      const ctxLogger = contextLogger.addContextLogger(args);
      event.execute(args, ctxLogger);
    });
  }
}

const commandsPath = path.join(__dirname, "../dist/commands");

// register commands, loop through scope folders and load all commands
client.commands = new Collection();
for (const commandFolderScope of fs.readdirSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(path.join(commandsPath, commandFolderScope))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, commandFolderScope, file));

    baseLogger.info(
      `Registering ${commandFolderScope} slash command: ${command.data.name}`
    );

    client.commands.set(command.data.name, command);
  }
}

client.on("interactionCreate", async (interaction) => {
  // build context
  const ctx = {
    interaction: interaction,
    logger: contextLogger.addContextLogger(interaction),
  };

  if (!ctx.interaction.isCommand()) return;

  const command = client.commands.get(ctx.interaction.commandName);

  if (!command) return;

  try {
    ctx.logger.info(
      `Attempting to execute command ${ctx.interaction.commandName}`
    );
    await command.execute(ctx);
  } catch (error) {
    console.error(error);
  }
});

process.on("unhandledRejection", (err) => {
  baseLogger.error(err);
});

client.login(config.token);
