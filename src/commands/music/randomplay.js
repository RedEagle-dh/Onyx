const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const c = require("../../../config/songs.json");
const {failVoiceEmbed, successEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Playing a random meme")
    ,
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "music")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const songs = c.songs;
        const memes = c.memepics;
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [failVoiceEmbed()]})
        } else {
            await event.client.DisTube.play(voice, songs[randomIntFromInterval(songs)])
            event.editReply({embeds: [new EmbedBuilder().setColor("#2F3136").setDescription("Playing a random meme").setImage(memes[randomIntFromInterval(memes)])], ephemeral: true})
        }


    },

}

function randomIntFromInterval(list) {
    return Math.floor(Math.random() * list.length)
}