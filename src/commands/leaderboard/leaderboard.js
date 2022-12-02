require('dotenv').config({path: "../../.env"});

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Leaderboard about the most active users")
        .addStringOption(option => option.setName("activity").setDescription("By which activity the leaderboard should be sorted").setRequired(true)
            .addChoices(
                {
                    name: "Messages",
                    value: "messages"
                },
                {
                    name: "Voicetime",
                    value: "voice"
                }
            ))
    ,
    async execute(event, redisClient) {
        const eb = new EmbedBuilder().setColor("#2F3136");
        const activity = event.options.getString("activity");
        const keys = await redisClient.keys(`${event.guild.id}-*`)
        const jsonList = [];
        for (let i = 0; i < keys.length; i++) {
            const jsonString = await redisClient.get(keys[i]);
            const jsonObj = JSON.parse(jsonString);
            jsonList.push(jsonObj);
        }
        const indexCounter = (i) => {
            if (i === 0) {
                return ":first_place:"
            } else if (i === 1) {
                return ":second_place:"
            } else if (i === 2) {
                return ":third_place:"
            } else {
                return `#${i + 1}`
            }

        }
        if (activity === "messages") {
            const numberWithCommas = (x) => {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            jsonList.sort((a, b) => b.messagecount - a.messagecount);

            const indexBot = jsonList.indexOf(jsonList.find(obj => obj.userid === event.client.user.id));
            jsonList.splice(indexBot, 1)
            const users = jsonList.map((e, i) => `${indexCounter(i)} <@${e.userid}>`).slice(0, 10).join("\n");
            const messages = jsonList.map(e => e.messagecount).slice(0, 10).join("\n");
            eb.setTitle(`:bar_chart: Leaderboard for messages`).addFields({
                    name: `User`,
                    value: `${users}`,
                    inline: true,
                },
                {
                    name: `Messages`,
                    value: `${numberWithCommas(messages)}`,
                    inline: true,
                },
                {
                    name: `\u200b`,
                    value: `\u200b`,
                    inline: true,
                })
        } else if (activity === "voice") {

            jsonList.sort((a, b) => b.voiceseconds - a.voiceseconds);
            const users = jsonList.map((e, i) => `${indexCounter(i)} <@${e.userid}>`).slice(0, 10).join("\n");
            const secondsEachUser = jsonList.map(e => e.voiceseconds).slice(0, 10);
            for (let i = 0; i < secondsEachUser.length; i++) {
                const seconds = secondsEachUser[i] % 60;
                let minutes;
                if ((secondsEachUser[i] / 60) >= 60) {
                    minutes = Math.floor(secondsEachUser[i] / 60 % 60);
                } else {
                    minutes = Math.floor(secondsEachUser[i] / 60);
                }
                const hours = Math.floor(secondsEachUser[i] / 60 / 60);
                secondsEachUser[i] = `${hours}h ${minutes}m ${seconds}s`;
            }
            eb.setTitle(`:bar_chart: Leaderboard for time spent in Voice Channels`).addFields({
                    name: `User`,
                    value: `${users}`,
                    inline: true,
                },
                {
                    name: `Voice Time`,
                    value: `${secondsEachUser.join("\n")}`,
                    inline: true,
                },
                {
                    name: `\u200b`,
                    value: `\u200b`,
                    inline: true,
                })
        }

        await event.editReply({embeds: [eb]})
    }
}