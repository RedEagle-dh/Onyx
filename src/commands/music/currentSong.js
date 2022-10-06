const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const c = require("../../../config/songs.json");
const {failVoiceEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("current")
        .setDescription("Shows the song and queue")
    ,
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
        if (!event.client.DisTube.getQueue(voice)) {
            event.editReply({embeds: [failEmbed("Bot isn't playing now")], ephemeral: true})
            return;
        }
        let currentQueue = `${event.client.DisTube.getQueue(voice).songs.slice(1).map(s => `- ${s.name}`).join("\n")}`;
        if (currentQueue === "") {
            currentQueue = "No songs in queue."
        }
        event.editReply({
            embeds: [new EmbedBuilder().setColor("#2F3136").setTitle(`🎵 NOW PLAYING: ${event.client.DisTube.getQueue(voice).songs[0].name}`).setDescription(`Uploaded by: ${event.client.DisTube.getQueue(voice).songs[0].uploader.name}\nDuration: ${event.client.DisTube.getQueue(voice).songs[0].formattedDuration}`).setThumbnail(`${event.client.DisTube.getQueue(voice).songs[0].thumbnail}`)
                .addFields({
                    name: "📜 Current Queue:",
                    value: `${currentQueue}`,
                    inline: true
                })], components: [], content: ""
        })


    }

}
