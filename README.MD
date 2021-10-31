# Frogbot

## Deploying commands

Deploying global commands can take up to an hour, so when developing deploy to a single guild.
This guild is defined in `config.managementGuildId`.

`node deploy-commands.js`

To deploy globally, run:

`RUNTIME=production node deploy-commands.js`

Note, deploying globally will still scope management commands to `config.managementGuildId`.