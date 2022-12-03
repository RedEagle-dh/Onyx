const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {failVoiceEmbed, failEmbed, successEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects the Bot"),
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
        event.client.DisTube.voices.leave(voice)
        event.editReply({embeds: [successEmbed("Bot successfully disconnected. To join type \`/join\`")], ephemeral: true})
    }
}