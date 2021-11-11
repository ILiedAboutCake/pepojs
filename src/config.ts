import "dotenv/config";

export default {
  token: process.env.TOKEN,
  clientId: "401939147981586443",
  managerId: "252869311545212928",
  managementGuildId: "886699047027605535",
  supportInvite: "",
  frogmodFlags: ["ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD"],
  legacyCommands: ["!pepo", "!frog"],
  rateLimit: {
    default: 5,
    min: 5,
    max: 120,
  },
  elasticServer: process.env.ELASTIC_SERVER,
};
