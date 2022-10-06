const {EmbedBuilder} = require("discord.js");

async function resolveButton(event) {
    const result = event.message.embeds[0].data.fields[0].value;
    const song = result.split(`**${event.customId}.** `)[1].split("\n**")[0]
    const voice = event.member.voice.channel;

    if (event.message.embeds[0].data.description === 'Select a song to skip the current one and play your selection') {
        if (event.client.DisTube.getQueue(voice) !== undefined) {
            event.client.DisTube.play(voice, song, {position: 1}).then(() => {
                event.client.DisTube.skip(voice);
                if (event.client.DisTube.getQueue(voice).paused) {
                    event.client.DisTube.resume(voice);
                }
                setTimeout(() => {
                    let currentqueue = `${event.client.DisTube.getQueue(voice).songs.slice(1).map(s => `- ${s.name}`).join("\n")}`;
                    if (currentqueue === "") {
                        currentqueue = "No songs in queue."
                    }
                    event.editReply({
                        embeds: [new EmbedBuilder().setColor("#2F3136").setTitle(`🎵 NOW PLAYING: ${event.client.DisTube.getQueue(voice).songs[0].name}`).setDescription(`Uploaded by: ${event.client.DisTube.getQueue(voice).songs[0].uploader.name}\nDuration: ${event.client.DisTube.getQueue(voice).songs[0].formattedDuration}`).setThumbnail(`${event.client.DisTube.getQueue(voice).songs[0].thumbnail}`)
                            .addFields({
                                name: "📜 Current Queue:",
                                value: `${currentqueue}`,
                                inline: true
                            })], components: [], content: ""
                    })
                }, 1000)
            })

        } else {
            await event.client.DisTube.play(voice, song)
            let currentqueue = `${event.client.DisTube.getQueue(voice).songs.slice(1).map(s => `- ${s.name}`).join("\n")}`;
            if (currentqueue === "") {
                currentqueue = "No songs in queue."
            }
            event.editReply({
                embeds: [new EmbedBuilder().setColor("#2F3136").setTitle(`🎵 NOW PLAYING: ${event.client.DisTube.getQueue(voice).songs[0].name}`).setDescription(`Uploaded by: ${event.client.DisTube.getQueue(voice).songs[0].uploader.name}\nDuration: ${event.client.DisTube.getQueue(voice).songs[0].formattedDuration}`).setThumbnail(`${event.client.DisTube.getQueue(voice).songs[0].thumbnail}`)
                    .addFields({
                        name: "📜 Current Queue:",
                        value: `${currentqueue}`,
                        inline: true
                    })], components: [], content: ""
            })
        }
    } else {
        await event.client.DisTube.play(voice, song)
        let currentqueue = `${event.client.DisTube.getQueue(voice).songs.slice(1).map(s => `- ${s.name}`).join("\n")}`;
        if (currentqueue === "") {
            currentqueue = "No songs in queue."
        }
        event.editReply({
            embeds: [new EmbedBuilder().setColor("#2F3136").setTitle(`🎵 NOW PLAYING: ${event.client.DisTube.getQueue(voice).songs[0].name}`).setDescription(`Uploaded by: ${event.client.DisTube.getQueue(voice).songs[0].uploader.name}\nDuration: ${event.client.DisTube.getQueue(voice).songs[0].formattedDuration}`).setThumbnail(`${event.client.DisTube.getQueue(voice).songs[0].thumbnail}`)
                .addFields({
                    name: "📜 Current Queue:",
                    value: `${currentqueue}`,
                    inline: true
                })], components: [], content: ""
        })
    }
}


module.exports = {resolveButton}