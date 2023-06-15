console.log("   ____                   \n  / __ \\                  \n | |  | |_ __  _   ___  __\n | |  | | '_ \\| | | \\ \\/ /\n | |__| | | | | |_| |>  < \n  \\____/|_| |_|\\__, /_/\\_\\\n                __/ |     \n               |___/      \n")
require('dotenv').config({path: ".env"});
const { Client, Collection, EmbedBuilder, ActionRowBuilder, Partials} = require("discord.js");
const { createButtons } = require("./functions/OuterFunctions");
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers", "GuildPresences", "GuildMessageReactions"], partials: [Partials.Reaction, Partials.Message, Partials.Channel] })
const fs = require("fs");
const deploy = require("./deploycommands");
const {getDatabase} = require("./database/database")
const redisClient = new getDatabase();
const { Logger } = require("./Log/getLogger");
const { exit } = require('process');
const __Log = new Logger();
deploy.data.deploycmd();


try {
    __Log.warn("Loading events...");
    const eventDirs = fs.readdirSync(__dirname + "/events");
    for (const dir of eventDirs) {
        const eventFiles = fs.readdirSync(__dirname + `/events/${dir}`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`./events/${dir}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...[...args, ...[redisClient, client, __Log]]));
            } else {
                client.on(event.name, (...args) => event.execute(...[...args, ...[redisClient, client, __Log]]));
            }
        }
    }
    __Log.success("Events successfully loaded!");
} catch (err) {
    __Log.error("Eventloader error: " + err);
    exit();
}


async function main() {
    try {
        __Log.warn("Loading commands...");
        client.commands = new Collection();
        const directories = fs.readdirSync(__dirname + "/commands");
        for (const directory of directories) {
            const commandFiles = fs.readdirSync(__dirname + `/commands/${directory}`).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(__dirname + `/commands/${directory}/${file}`);
                client.commands.set(command.data.name, command);
            }
        }
        __Log.success("Commands successfully loaded!");
    } catch (err) {
        __Log.error("Commandloader error: " + err);
        exit();
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
        __Log.error(`Error while getting serverconfig: ${err}`);
        exit();
    })
}


main();

process.on("unhandledRejection", (err) => {
    __Log.error("Unhandled rejection: " + err);
})

const interval = 1000 * 60 * 60;
__Log.debug(`Started tempban interval: ${interval / 1000}s`)
setInterval(async () => {
    __Log.debug(`Tempban check running.`)
    try {
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
        __Log.debug(`Tempban check succeeded.`)
    } catch (err) {
        __Log.error(`Tempban check failed for some reason: ${err}`)
    }
}, interval)

client.login(process.env.TOKEN);