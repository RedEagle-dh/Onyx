require('dotenv').config({path: ".env"});
const fs = require("fs");
const {REST} =  require("@discordjs/rest");
const {Routes} = require("discord-api-types/v10");
const rest = new REST({version: '10'}).setToken(process.env.TOKEN)
const { Logger } = require("./Log/getLogger")
const __Log = new Logger();
const methods = {};

methods.deploycmd = async function run() {
    const commands = [];

    const directories = fs.readdirSync(__dirname + "/commands");
    for (const directory of directories) {
        const commandFiles = fs.readdirSync(__dirname + `/commands/${directory}`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(__dirname + `/commands/${directory}/${file}`);
            commands.push(command.data.toJSON());
        }
    }

    try {
        __Log.warn(`Started refreshing ${commands.length} application (/) commands.`);
        await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
            body: commands,
        });
        __Log.info(`${commands.length} application (/) commands refreshed.`);
    } catch (err) {
        __Log.error("Failed refreshing commands: " + err);
    }
}

exports.data = methods;

