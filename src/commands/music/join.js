const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {failVoiceEmbed, successEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Bot joining in your channel"),
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
        await event.client.DisTube.voices.join(voice)
        event.editReply({embeds: [successEmbed("Bot successfully joined. To disconnect type \`/disconnect\`")]})


    }
}