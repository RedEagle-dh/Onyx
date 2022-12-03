const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const c = require("../../../config/songs.json");
const {failVoiceEmbed, failEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the current queue")
    ,
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "music", redisClient)) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const songs = c.songs;
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [failVoiceEmbed()]})
            return;
        }
        if (!event.client.DisTube.getQueue(voice)) {
            event.editReply({embeds: [failEmbed("No queue available")], ephemeral: true})
            return;
        }
        const eb = new EmbedBuilder().setColor("#2F3136").setTitle("📜 Current Queue").addFields({name: "Your Songs:", value: `${event.client.DisTube.getQueue(voice).songs.slice(1).map(song => `**${song.name}** | \`${song.formattedDuration}\``).join("\n")}`})
        event.editReply({embeds: [eb]})


    }

}
