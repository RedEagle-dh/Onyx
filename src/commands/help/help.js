const {
    SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder,
    PermissionsBitField
} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("You need help? Here you go!")
    ,
    async execute(event) {
        const mainHelpEb = new EmbedBuilder().setTitle("Help - Here you go!").setColor("#2F3136")
            .setDescription("Just select a section below to get more information about the commands and their usage.\n\n" +
                "<:admin:1017813378091192510> Only admins can use this command\n" +
                "<:moderator:1017814724412448881> Only members with the permission `ManageMessages` can use this\n" +
                "<:botdev:1017814722873139231> Only the bot developers can use this command\n" +
                "<:nitropink:1017817420553003059> Only nitro booster can use this command\n" +
                "<:member:1017817633808191640> Every member can use this command\n\n\n")
        let actionRow = new SelectMenuBuilder().setCustomId("help");
        if (event.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

            actionRow.addOptions(
                new SelectMenuOptionBuilder().setLabel("Moderation").setDescription("Moderation commands").setValue("moderation").setEmoji("1017814724412448881"))
        }
        if (event.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            actionRow.addOptions(
                new SelectMenuOptionBuilder().setLabel("Admin").setDescription("Admin Commands").setValue("admin").setEmoji("1017813378091192510"))
        }
        if (event.member.id === "324890484944404480" || event.member.id === "350689450759553025" || event.member.id === "569695766042509330") {
            actionRow.addOptions(
                new SelectMenuOptionBuilder().setLabel("Bot Developer").setDescription("Bot Developer Commands").setValue("botdev").setEmoji("1017814722873139231"),
            )
        }
        actionRow.addOptions(
            new SelectMenuOptionBuilder().setLabel("General").setDescription("General commands").setValue("general").setEmoji("1017817633808191640"),
            new SelectMenuOptionBuilder().setLabel("Nitro Booster").setDescription("Commands for nitro booster").setValue("nitro").setEmoji("1017817420553003059"),
            new SelectMenuOptionBuilder().setLabel("Functions").setDescription("All the funcions the bot has").setValue("functions").setEmoji("1017841129368072252"),
        )


        event.reply({embeds: [mainHelpEb], components: [new ActionRowBuilder().addComponents(actionRow)], ephemeral: true})
    }
}