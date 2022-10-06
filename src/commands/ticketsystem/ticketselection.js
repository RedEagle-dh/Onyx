require('dotenv').config({path: "../../.env"});
const redisClient = require("../../database/database")
const { SlashCommandBuilder, SelectMenuBuilder,  ActionRowBuilder,  SelectMenuOptionBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketselection")
        .setDescription("Sending a message for ticketselection")
    ,
    async execute(event) {
        const channel = event.channel;
        const roles = await redisClient.keys(`ticketselection-${event.guild.id}-*`).catch((err) => {
            eb.setColor("Red").addFields({
                name: ":x: Database error",
                value: `\`\`\`${err.message}\`\`\``,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        });

        const result = [];
        for (let i = 0; i < roles.length; i++) {
            result.push(JSON.parse(await redisClient.get(roles[i])));
        }
        const ebmenu = new EmbedBuilder()
            .setColor("#2F3136")
            .setTitle("Select a role")
            .setDescription(`If you have an issue or a question to us please open a ticket below and we will help you!\n\n
            ${result.map(row => `${event.client.emojis.cache.get(row.emoji)} ${row.ticketname}`).join("\n")}`)
            .setColor("#2F3136")
        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
            name: ":white_check_mark: Menu sent!",
            value: "Select-menu sent to this channel!",
            inline: true
        });

        await event.editReply({embeds: [eb], ephemeral: true});

        if (roles.length === 0) {
            const eb = new EmbedBuilder()
                .addFields({
                    name: ":x: No tickets found!",
                    value: "Please create a ticket first!",
                    inline: false
                })
                .setColor("Red");
            event.editReply({embeds: [eb], ephemeral: true});
            return;
        }


        const actionRow = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder().setCustomId("ticketselection").addOptions(
                ...getSelectMenuOptions(result)
            ).setMaxValues(1).setMinValues(0).setPlaceholder("Select a Ticket")
        )

        channel.send({embeds: [ebmenu], components: [actionRow]}).catch(async () => {

            const newEb = new EmbedBuilder().setColor("Red").addFields({
                name: ":x: Error",
                value: "I couldn't send the select-menu. The select-menu has to be hold one or more items!",
                inline: true
            })
            event.editReply({embeds: [newEb], ephemeral: true});

        });

    }
}


function getSelectMenuOptions(result) {
    const list = [];
    result.forEach(row => {
        list.push(new SelectMenuOptionBuilder().setLabel(`${row.ticketname}`).setDescription(`${row.description}`).setValue(`${row.ticketname.toLowerCase().replaceAll(" ", "_")}`).setEmoji(`${row.emoji}`));
    })
    list.sort((a, b) => a.data.label.localeCompare(b.data.label));
    return list;
}
