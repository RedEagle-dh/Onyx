
require('dotenv').config({path: "../../.env"});
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("removeticket")
        .setDescription("Removing a ticket from the select-menu")
        .addStringOption(option => option.setName("ticketname").setDescription("The name of the ticket").setRequired(true)),
    async execute(event, redisClient) {
        const formattedGameName = event.options.getString("ticketname").toLowerCase().replace(/ /g, "_");
        const eb = new EmbedBuilder().setColor("#2F3136");
        redisClient.del(`ticketselection-${event.guild.id}-${formattedGameName}`).then(() => {
            eb.addFields({
                name: ":white_check_mark: Success",
                value: `The role \`${event.options.getString("ticketname")}\` was removed from the select-menu!`,
                inline: true
            });
            event.reply({embeds: [eb], ephemeral: true});
        }).catch((err) => {
            eb.setColor("Red").addFields({
                name: ":x: Database error",
                value: `\`\`\`${err.message}\`\`\``,
                inline: true
            })
            event.reply({embeds: [eb], ephemeral: true});
        })

    }
}

