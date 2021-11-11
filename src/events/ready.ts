import winston from "winston";
import { PepoClient } from "../types";

export default {
  name: "ready",
  once: true,
  execute(client: PepoClient, baseLogger: winston.Logger) {
    baseLogger.info(`Logged into Discord gateway as ${client.user?.id}`);

    client.user?.setActivity("/pepo | /getpepo");
  },
};
