const {PermissionFlagsBits} = require("discord-api-types/v10");
const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const Blacklist = require('../../config/Models/blacklistmodel');
module.exports = {

    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist of this server")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand => subcommand.setName("show").setDescription("Shows the current blacklist"))
        .addSubcommand(subcommand => subcommand.setName("add").setDescription("Adds a word to the blacklist")
            .addStringOption(option => option.setName("word").setDescription("The future blacklist word").setRequired(true))
            .addStringOption(option => option.setName("checktype").setDescription("Whether the string should be contained or excluded in other words")
                .addChoices({name: "INCLUDED", value: "INCLUDED"}, {name: "EXCLUDED", value: "EXCLUDED"}).setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName("remove").setDescription("Removes a word from the blacklist")
            .addStringOption(option => option.setName("word").setDescription("The word which should be removed").setRequired(true))
        )
    ,
    async execute(event) {
        const embed = new EmbedBuilder().setColor("#000000");
        if (event.options.getSubcommand() === "add") {
            embed.addFields([{
                name: ":white_check_mark: Success",
                value: `You have added \`${event.options.getString("word")}\` successfully to the blacklist.`,
                inline: true
            }])
            const blacklist = new Blacklist({
                word: event.options.getString("word"),
                modid: event.member.id,
                kindofcheck: event.options.getString("checktype")
            })
            blacklist.save().then(r => {
                console.log("New Blacklist word saved")
            }).catch((err) => {
                console.log(err)
            })
            event.editReply({embeds: [embed], ephemeral: true});
        } else if (event.options.getSubcommand() === "remove") {

            await Blacklist.findOneAndRemove({word: event.options.getString("word")}).exec()
            embed.addFields([{
                name: ":white_check_mark: Success",
                value: `You have removed \`${event.options.getString("word")}\` successfully from the blacklist.`,
                inline: true
            }])
            event.editReply({embeds: [embed], ephemeral: true});
        } else if (event.options.getSubcommand() === "show") {
            Blacklist.find().then((r) => {

            })
            embed.setTitle("Blacklist");

            const words = await Blacklist.find({}).exec();
            Blacklist.countDocuments({}, (n, e) => {
                if (e === 0) {
                    embed.setDescription("No entries yet!")
                } else {
                    for (let i = 0; i < e; i++) {

                        embed.addFields({
                                name: 'Word',
                                value: words[i].get("word"),
                                inline: true
                            },
                            {
                                name: 'Checktype',
                                value: words[i].get("kindofcheck"),
                                inline: true
                            },
                            {
                                name: 'Moderator',
                                value: '<@' + words[i].get("modid") + '>',
                                inline: true
                            }
                        );
                    }
                }
                event.editReply({embeds: [embed], ephemeral: true});
            })



        }

    }

}