import { CommandInteraction, Message } from "discord.js";
import winston from "winston";

export interface Ctx {
  logger: winston.Logger;
  interaction: Message | CommandInteraction;
}

export type LoggerCtx = partialCtx | messageCtx | interactionCtx | unkownCtx;

export interface partialCtx {
  interactionType: "MessagePartial";
  clientID?: string;
}

export interface messageCtx {
  interactionType: "Message";
  clientID?: string;
  guildID: string;
  guildName: string;
  channelID: string;
  channelName: string;
  userID: string;
  userName: string;
  messageContent: string;
  commandName: "Legacy";
}

export interface interactionCtx {
  interactionType: "CommandInteraction";
  clientID?: string;
  guildID: string;
  guildName: string;
  channelID: string;
  channelName: string;
  userID: string;
  userName: string;
  commandName: string;
}

export interface unkownCtx {
  interactionType: "Unknown";
  clientID?: string;
}
