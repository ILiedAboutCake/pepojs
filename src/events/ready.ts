import winston from "winston";
import { PepoClient } from "../types";

module.exports = {
  name: "ready",
  once: true,
  execute(client: PepoClient, baseLogger: winston.Logger) {
    baseLogger.info(`Logged into Discord gateway as ${client.user?.id}`);

    client.user?.setActivity("/pepo | /getpepo");
  },
};
