const redisClient = require("../../database/database")
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../messages/embeds/embedHandler");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("removevoice")
        .setDescription("Removing a voice genre from the select-menu")
        .addStringOption(option => option.setName("voicename").setDescription("The name of the game").setRequired(true))
    ,
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "customchannels", redisClient)) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const voiceName = event.options.getString("voicename");
        const formattedVoiceName = voiceName.toLowerCase().replace(/ /g, "_");
        let eb;
        redisClient.del(`voice-${formattedVoiceName}`).then(() => {
            eb = new EmbedBuilder().setColor("#2F3136").addFields({
                name: ":white_check_mark: Success",
                value: `The voice genre \`${voiceName}\` was removed from the select-menu!`,
                inline: true
            });
            event.editReply({embeds: [eb], ephemeral: true});
        }).catch((err) => {
            eb.setColor("Red").addFields({
                name: ":x: Database error",
                value: `\`\`\`${err.message}\`\`\``,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        });
    }
}

