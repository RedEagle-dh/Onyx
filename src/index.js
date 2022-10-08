require('dotenv').config({path: "../.env"});
const { Client, Collection, EmbedBuilder, ActionRowBuilder, Partials} = require("discord.js");
const { DisTube } = require("distube");
const { createButtons } = require("./functions/OuterFunctions");
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers", "GuildPresences", "GuildMessageReactions"], partials: [Partials.Reaction, Partials.Message, Partials.Channel] })
const fs = require("fs");
const deploy = require("./deploycommands");
const discordModals = require("discord-modals");
const redisClient = require("./database/database")
deploy.data.deploycmd();

discordModals(client);

const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
async function main() {

    client.commands = new Collection();
    const directories = fs.readdirSync("./commands");
    for (const directory of directories) {
        const commandFiles = fs.readdirSync(`./commands/${directory}`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`./commands/${directory}/${file}`);
            client.commands.set(command.data.name, command);
        }
    }

    redisClient.get(`serverconfig`).then((response) => {
        if (response === null) {
            redisClient.set(`channelconfigs`, JSON.stringify(Object({
                logchannel: "",
                voicecategorychannel: "",
                welcomechannel: "",
                immunevoices: []
            })))
        }
    }).catch((err) => {
        console.log(err)
    })
}


main();

client.DisTube = new DisTube(client, {
    searchSongs: 5,
    leaveOnStop: false,
    emitNewSongOnly: true,
})

client.DisTube.on("searchResult", (event, result) => {
    const eb = new EmbedBuilder();
    if (event.commandName === "playskip") {

        eb.setTitle("Search Results").setDescription("Select a song to skip the current one and play your selection").setColor("#2F3136")
    } else {
        eb.setTitle("Search Results").setDescription("Select a song to add to the queue").setColor("#2F3136")
    }

    let res = "";
    result.forEach((song, index) => {
        res = res + `**${index + 1}.** ${song.name}\n`
    })
    const buttons = new ActionRowBuilder()
        .addComponents(
            ...createButtons(result)
        )
    eb.addFields({
        name: "Results",
        value: `${res}`,
        inline: true
    })
    event.editReply({embeds: [eb], components: [buttons]})

})

process.on("unhandledRejection", (err) => {
    console.log("Error:", err)
})

setInterval(async () => {
    await redisClient.keys(`tempbans-*`).then(async (response) => {
        for (const key of response) {
            await redisClient.get(key).then(async (response) => {
                const jsonObj = JSON.parse(response);
                for (const ban of jsonObj.bans) {
                    if (ban.unbandate <= Date.now()) {
                        await client.guilds.cache.get(key.split("-")[1]).members.unban(ban.user, "Tempban expired")
                        const index = jsonObj.bans.indexOf(ban);
                        if (index > -1) {
                            jsonObj.bans.splice(index, 1);
                        }
                        redisClient.set(key, JSON.stringify(jsonObj))
                    }
                }
            })
        }
    })
}, 1000 * 60 * 60)

client.login(process.env.TOKEN);