const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {failVoiceEmbed, successEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops the music"),
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
        await event.client.DisTube.stop(voice)
        await event.client.DisTube.voices.leave(voice);

        event.editReply({embeds: [successEmbed("Bot successfully stopped. To start type \`/play\`")], ephemeral: true})
    }
}