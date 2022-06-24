const { Command } = require('@sapphire/framework')
const { MessageEmbed } = require('discord.js');
class HelpCommand extends Command {
    constructor(context, options) {
        super(context, {
            name: 'help',
            description: 'Returns bot help',
            detailedDescription: '[] | [command]',
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
                    .addStringOption(option => option.setName('commandname').setDescription('command name to query help for')),
            { guildIds: [], idHints: ['948024837815820296'], behaviorWhenNotIdentical: ['OVERWRITE'] }
        );
    }
    async chatInputRun(interaction, client) {
        var fun = [], info = [], moderation = [], util = [], image = [], config = [], bot = []

        this.store.forEach(cmd => {
            const commandCategory = cmd.fullCategory[0]
            if (cmd.name === 'eval') return 
            switch (commandCategory) {
                case 'fun':
                    fun.push(`\`${cmd.name}\``)
                    break;
                case 'info':
                    info.push(`\`${cmd.name}\``)
                    break;
                case 'moderation':
                    moderation.push(`\`${cmd.name}\``)
                    break;
                case 'util':
                    util.push(`\`${cmd.name}\``)
                    break;
                case 'image':
                    image.push(`\`${cmd.name}\``)
                    break;
                case 'config':
                    config.push(`\`${cmd.name}\``)
                    break;
                case 'bot':
                    bot.push(`\`${cmd.name}\``)
                    break;
                default:
                    break;
            }
        })
        // If you do not want to have a certain field put // in front of the .addField
        // Only add the field if there is commands in the field
        // Eval is not included in command list for safety purposes
        if (!interaction.options.getString('commandname')) {
            var embed = new MessageEmbed()
                // .addField("Fun", fun.join(", "))
                // .addField("Moderation", moderation.join(", "))
                // .addField("Image", image.join(", "))
                // .addField("Config", config.join(", "))
                .addField("Bot", bot.join(", "))
                .addField("Info", info.join(", "))
                // .addField("Util", util.join(", "))
            interaction.reply({ embeds: [embed] })
        } else {
            this.store.forEach(cmd => {
                if (cmd.name === interaction.options.getString('commandname')) {
                    var embed = new MessageEmbed()
                        .addField(cmd.name, cmd.description)
                        .addField('Usage', `/${cmd.name} ${cmd.detailedDescription}`)
                        .setFooter({ text: 'Do not literally type out < > [ ] | ect.' })
                        .addField('Usage', '| or\n[] argument 1\n<> argument 2')
                    interaction.reply({ embeds: [embed], })
                }
            });
            if (!embed) {
                embed = new MessageEmbed()
                    .setTitle("Error")
                    .setDescription(`Couldn't find command \`${interaction.options.getString('commandname')}\``)
                interaction.reply({ embeds: [embed], })
            }
        }
    }
};

module.exports = {
    HelpCommand
};