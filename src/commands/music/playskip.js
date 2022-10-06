const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const c = require("../../../config/songs.json");
const {SearchResultType} = require("distube");
const {failVoiceEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("playskip")
        .setDescription("Skips the current and plays the given song.")
        .addStringOption(option => option.setName("songname").setDescription("The songname").setRequired(true))
    ,
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "music")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const songs = event.options.getString("songname");
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [failVoiceEmbed()]})
        } else {
            event.client.DisTube.search(songs, {limit: 5, type: SearchResultType.VIDEO}).then(res => {
                event.client.DisTube.emit("searchResult", event, res)
            })
        }
    }

}
