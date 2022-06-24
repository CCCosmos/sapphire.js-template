const { Command } = require('@sapphire/framework')
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
        await interaction.reply({ content: 'Ping?', fetchReply: true });
        interaction.editReply(`Pong! Took ${Date.now() - interaction.createdTimestamp}ms.`);
    }
}

module.exports = {
    PingCommand
};