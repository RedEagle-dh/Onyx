const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {failVoiceEmbed, successEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the music"),
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "music", redisClient)) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [failVoiceEmbed()]})
            return;
        }
        if (!event.client.DisTube.getQueue(voice)) {
            event.editReply({embeds: [failEmbed("Bot isn't playing now")], ephemeral: true})
            return;
        }

        if (event.client.DisTube.getQueue(voice).playing) {
            event.client.DisTube.pause(voice)
            event.editReply({
                embeds: [successEmbed("Bot successfully paused. To resume type \`/resume\`")],
                ephemeral: true
            })
        } else {
            event.editReply({embeds: [failEmbed("Bot is not playing now")], ephemeral: true})
        }


    }
}