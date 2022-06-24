const { Command } = require('@sapphire/framework')
const { MessageEmbed } = require('discord.js');

class EvalCommand extends Command {
    constructor(context, options) {
        super(context, {
            name: 'eval',
            description: 'Evaluates code',
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
                    .setDescription(this.description)
                    .addStringOption(option => option.setName('input').setDescription('Enter a string').setRequired(true)),
            { guildIds: ['586818512996270097'], idHints: ['942334140068544522'], behaviorWhenNotIdentical: ['OVERWRITE'] }
        );
    }
    async chatInputRun(interaction) {
        await interaction.deferReply();
        if (interaction.user.id !== process.env.OWNER_ID) {
            var errorembed = new MessageEmbed()
                .setTitle("Only the bot owner can use this command!")
            return interaction.followUp({ embeds: [errorembed], ephemeral: true })
        }
        const t0 = performance.now();
        var author = interaction.user;
        try {
            const code = interaction.options.getString('input');
            let evaled = eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            if (clean(evaled).length >= 2000) {
                var errorembed = new MessageEmbed()
                    .setTitle("Evaluation is over 2000 characters long, the length is " + clean(evaled).length)
                interaction.followUp({ embeds: [errorembed], ephemeral: true })
            } else {
                var t1 = performance.now();
                var embed = new MessageEmbed()
                    .setTitle("Evaluated Code: " + clean(evaled).length)
                    .setDescription("```nimrod\n" + clean(evaled) + "```")
                    .setFooter({ text: "Took " + (t1 - t0).toFixed(3) + "ms (" + ((t1 - t0) * 1000).toFixed(3) + "µs)" });
                interaction.followUp({ embeds: [embed], })
            }
        } catch (err) {
            interaction.followUp({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``, ephemeral: true });
        }
    }
};
const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports = {
    EvalCommand
};