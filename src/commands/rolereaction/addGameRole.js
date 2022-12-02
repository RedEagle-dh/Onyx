
require('dotenv').config({path: "../../.env"});
const { createRoleSelectionDoc } = require("../../functions/jsonCreator");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rradd")
        .setDescription("Adding a role to the select-menu")
        .addStringOption(option => option.setName("gamename").setDescription("The name of the game").setRequired(true))
        .addStringOption(option => option.setName("emoji").setDescription("The emoji you want to use").setRequired(true))
        .addRoleOption(option => option.setName("role").setDescription("The role for the select-menu").setRequired(true))
    ,
    async execute(event, redisClient) {
        const role = event.options.getRole("role");
        const gamename = event.options.getString("gamename");
        const formattedGameName = gamename.toLowerCase().replace(/ /g, "_");
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

        const beschreibung = "Giving/Removing " + role.name + " from you";
        redisClient.set(`roleselection-${event.guild.id}-${formattedGameName}`, createRoleSelectionDoc(role.id, gamename, beschreibung, emojiId)).then(() => {
            eb.addFields({
                name: ":white_check_mark: Done",
                value: `${role} added to the select-menu!`,
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

