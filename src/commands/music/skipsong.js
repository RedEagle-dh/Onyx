const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const {failVoiceEmbed, successEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
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
        let embed;
        console.log(event.client.DisTube.getQueue(voice).songs.length)
        if (event.client.DisTube.getQueue(voice).songs.length !== 1) {
            await event.client.DisTube.skip(voice).then((song) => {
                console.log(song.name)
            });
            embed = successEmbed("Song skipped successfully.")
        } else {
            embed = failEmbed("No songs in queue.")
        }


        event.editReply({embeds: [embed], ephemeral: true})
    }
}