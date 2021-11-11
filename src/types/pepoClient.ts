import { Client, Collection } from "discord.js";

export class PepoClient extends Client {
  public commands: Collection<any, any> = new Collection();
}
