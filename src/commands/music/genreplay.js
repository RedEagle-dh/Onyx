const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const c = require("../../../config/songs.json");
const {failVoiceEmbed, successEmbed, featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("genre")
        .setDescription("Starts playing music from a genre(You must be in a channel)")
        .addStringOption(option => option.setName("name").setDescription("The name of the genre").setRequired(true).addChoices(
            {
                name: "Rave",
                value: "rave"
            },
            {name: "Ballermann", value: "ballermann"}
        ))
    ,
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "music")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const voice = event.member.voice.channel;
        if (!voice) {
            event.editReply({embeds: [failVoiceEmbed()]})
        } else {
            switch (event.options.getString("name")) {
                case "rave": {
                    const songs = c.rave;
                    let s = [];
                    songs.forEach(song => {
                        s.push(song)
                    });

                    const playlist = await event.client.DisTube.createCustomPlaylist(s, {
                        properties: {
                            name: "Rave Playlist",
                            source: "custom"
                        }, parallel: true
                    });
                    await event.client.DisTube.play(voice, playlist).then(() => {
                        resolveButton(event)
                    });
                    break;
                }
                case "ballermann": {
                    const songs = c.ballermann;
                    let s = [];
                    songs.forEach(song => {
                        s.push(song)
                    });

                    const playlist = await event.client.DisTube.createCustomPlaylist(s, {
                        properties: {
                            name: "Ballermann Playlist",
                            source: "custom"
                        }, parallel: true
                    });
                    event.client.DisTube.play(voice, playlist).then(() => {
                        resolveButton(event)
                    });

                    break;
                }
            }
        }
    }
}

async function resolveButton(event) {
    const voice = event.member.voice.channel;

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
