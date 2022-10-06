const {PermissionFlagsBits} = require("discord-api-types/v10");
const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clearmsg")
        .setDescription("Deletes a certain number of messages")
        .addIntegerOption(option =>
            option.setName("number")
                .setDescription("The number of messages")
                .setRequired(true)
        ),
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "moderation")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }

        const anzahl = event.options.getInteger("number");

        await event.channel.bulkDelete(anzahl).then(() => {
            const embed = new EmbedBuilder().setColor("#2F3136")
                .addFields([{
                    name: `:white_check_mark: Success`,
                    value: `${anzahl} message(s) deleted successfully!`,
                    inline: true
                }])
            event.reply({embeds: [embed], ephemeral: true})
        }).catch((error) => {
            const embed = new EmbedBuilder().setColor("#2F3136")
                .addFields([{
                    name: `:x: Error`,
                    value: `${error.message}`,
                    inline: true
                }])
            event.reply({embeds: [embed], ephemeral: true})
        });
    }

}