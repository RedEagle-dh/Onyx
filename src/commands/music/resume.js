const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {failVoiceEmbed, successEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the music"),
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "music")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [failVoiceEmbed()]})
            return;
        }
        if (event.client.DisTube.getQueue(voice) !== undefined) {
            if (event.client.DisTube.getQueue(voice).paused) {
                event.client.DisTube.resume(voice)

                event.editReply({embeds: [successEmbed("Bot successfully resumed. To pause type \`/pause\`")], ephemeral: true})
            } else {
                event.editReply({embeds: [failEmbed("Bot isn't paused now")], ephemeral: true})
            }
        } else {
            event.editReply({embeds: [failEmbed("Bot isn't playing now")], ephemeral: true})
        }

    }
}