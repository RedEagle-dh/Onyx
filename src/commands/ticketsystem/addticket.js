
require('dotenv').config({path: "../../.env"});
const redisClient = require("../../database/database")
const { createRoleSelectionDoc, createTicketSelectionDoc} = require("../../functions/jsonCreator");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addticket")
        .setDescription("Adding a ticket to the select-menu")
        .addStringOption(option => option.setName("ticketname").setDescription("The name of the ticket").setRequired(true))
        .addStringOption(option => option.setName("emoji").setDescription("The emoji you want to use").setRequired(true))
    ,
    async execute(event) {
        const ticketname = event.options.getString("ticketname");
        const formattedticketname = ticketname.toLowerCase().replace(/ /g, "_");
        const eb = new EmbedBuilder().setColor("#2F3136");
        let emojiId;
        try {
            emojiId = event.options.getString("emoji").split(":")[2].split(">")[0];
        } catch (e) {
            eb.addFields({
                name: ":x: Error",
                value: "The emoji is not valid. It must be a custom Emote from this discord server!",
                inline: true
            })
            event.reply({embeds:[eb], ephemeral: true});
            return;
        }

        const beschreibung = "Create a support Ticket";
        redisClient.set(`ticketselection-${event.guild.id}-${formattedticketname}`, createTicketSelectionDoc(ticketname, beschreibung, emojiId)).then(() => {
            eb.addFields({
                name: ":white_check_mark: Done",
                value: `\`${ticketname}\` added to the select-menu!`,
                inline: true
            })
            event.editReply({embeds:[eb], ephemeral: true});
        }).catch((err) => {
            eb.setColor("Red").addFields({
                name: ":x: Database error",
                value: `\`\`\`${err.message}\`\`\``,
                inline: true
            })
            event.editReply({embeds:[eb], ephemeral: true});
        });
    }
}

