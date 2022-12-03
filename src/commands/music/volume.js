const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {successEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("vol")
        .setDescription("Sets the volume of the music")
        .addIntegerOption(option => option.setName("volume").setDescription("The volume of the music").setRequired(true).setMinValue(0).setMaxValue(100)),
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "music", redisClient)) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [new EmbedBuilder().setColor("Red").addFields({name: ":x: Failure", value: "You have to be in a voice channel!", inline: true})], ephemeral: true})
            return;
        }
        if (!event.client.DisTube.getQueue(voice)) {
            event.editReply({embeds: [failEmbed("Bot isn't playing now")], ephemeral: true})
            return;
        }
        event.editReply({embeds: [successEmbed(`Volume set from ${event.client.DisTube.getQueue(voice).volume}% to ${event.options.getInteger("volume")}%`)], ephemeral: true})
        event.client.DisTube.setVolume(voice, event.options.getInteger("volume"))

    }
}