require("dotenv").config();
const db = require("./db/manager");
const { LogLevel, SapphireClient } = require("@sapphire/framework");
const Canvas = require("canvas");
const {
  Collection,
  Intents,
  MessageEmbed,
  Permissions,
  MessageAttachment,
} = require("discord.js");
const util = require('@chaos/util')
const client = new SapphireClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  // i18n: {
  // 	fetchLanguage: async (context) => {
  // 		if (!context.guild) return 'en-US';
  // 		// const guildSettings = await db.find({ guild_id: context.guildId });
  // 		return guildSettings.language;
  // 	}
  // },
  logger: {
    level: LogLevel.Debug,
  },
  loadMessageCommandListeners: true,
});
const webPortal = require("./server");
webPortal.load(client);
const welcomeConfig = {
  displayName: "Welcome Channel",
  dbName: "WELCOME_CHANNEL",
};
const manager = require("./db/manager");
// cmdManager.registerCommands(client);
exports.commands = client.commands;
const mongoose = require("mongoose");
const wait = require("util").promisify(setTimeout);
client.once("ready", async (client) => {
  console.log("Ready!");
  client.user.setActivity(`v${require("./package.json").version}`, {
    type: "PLAYING",
  });
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((mongoose) => {
      try {
        console.log("Connected to MongoDB");
      } catch (error) {
        console.log(`${error} could not connect to mongo DB`);
      }
    });
});

client.on("guildCreate", async (guild) => {
  if (!guild.available) return;

  await db.createWelcomeMessage(guild.id);

  console.log(`Joined server: ${guild.name}`);
});

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 70;
  do {
    context.font = `${(fontSize -= 10)}px consolas`;
  } while (context.measureText(text).width > canvas.width - 300);
  return context.font;
};

client.on("guildMemberAdd", async (member) => {
  const result = await manager.findWelcomeMessage(member.guild.id);
  const channel = member.guild.channels.cache.get(result.channelId);
  if(!channel){
    member.client.users.cache.get(member.guild.ownerId).send('test')
  }
  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext("2d");
  if(!result.enabled) return;
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#fffff";
  context.strokeRect(0, 0, canvas.width, canvas.height);

  context.font = "28px consolas";
  context.fillStyle = "#ffffff";
  context.fillText("Welcome", canvas.width / 2.5, canvas.height / 3.5);

  context.font = applyText(canvas, `${member.user.tag}`);
  context.fillStyle = "#ffffff";
  context.fillText(
    `${member.user.tag}`,
    canvas.width / 2.5,
    canvas.height / 1.8
  );
  context.font = applyText(canvas, `You are the ${util.toOrdinalSuffix(member.guild.memberCount)} Member`);
  context.fillStyle = "#ffffff";
  context.fillText(
    `You are the ${util.toOrdinalSuffix(member.guild.memberCount)} Member`,
    canvas.width / 2.5,
    canvas.height / 1.25
  );

  context.beginPath();
  context.arc(125, 125, 105, 0, 2 * Math.PI, false);
  context.fillStyle = "#fffff";
  context.fill();
  context.beginPath();
  context.strokeStyle = "#fffff";
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();
  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpg", size: 256 })
  );
  context.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );
  welcomeMessage = result.welcomeMessage.replace(/@/g, `<@${member.id}>`);
  await channel.send({ files: [attachment], content: welcomeMessage });
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(
    "[FATAL] Possibly Unhandled Rejection at: Promise ",
    promise,
    " reason: ",
    reason.message
  );
});
if (process.env.ENVIRONMENT === "PRODUCTION") {
  client.login(process.env.TOKEN_PROD);
} else {
  client.login(process.env.TOKEN);
}
