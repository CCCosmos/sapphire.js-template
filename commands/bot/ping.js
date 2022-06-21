const { Command } = require('@sapphire/framework')
const { SlashCommandBuilder } = require('@discordjs/builders')
const ping = require('ping')
class PingCommand extends Command {
    constructor(context, options) {
        super(context, {
            name: 'ping',
            description: 'Returns latency for the bot',
            detailedDescription: '',
            chatInputCommand: {
                register: true
            },
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description),
            { guildIds: [], idHints: ['942339611974307855'], behaviorWhenNotIdentical: ['OVERWRITE'] }
        );
    }
    async chatInputRun(interaction) {
        if (interaction.guild === null) {
            var sent = await interaction.reply({ content: 'Ping?', fetchReply: true });
            (async function () {
                const result = await ping.promise.probe('www.google.com', {});
                const discord = await ping.promise.probe('www.discord.com', {});
                interaction.editReply(`Pong! Took ${Date.now() - interaction.createdTimestamp}ms. (Discord latency: ${Math.round(discord.avg)}ms. Network latency: ${Math.round(result.avg)}ms)`);
            })();
        } else {
            var sent = await interaction.reply({ content: 'Ping?', fetchReply: true });
            (async function () {
                const result = await ping.promise.probe('www.google.com', {});
                const discord = await ping.promise.probe('www.discord.com', {});
                interaction.editReply(`Pong! Took ${sent.createdTimestamp - interaction.createdTimestamp}ms. (Discord latency: ${Math.round(discord.avg)}ms. Network latency: ${Math.round(result.avg)}ms)`);
            })();
        }
    }
}

module.exports = {
    PingCommand
};