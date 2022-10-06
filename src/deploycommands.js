require('dotenv').config({path: "../.env"});
const fs = require("fs");
const {REST} =  require("@discordjs/rest");
const {Routes} = require("discord-api-types/v10");
const rest = new REST({version: '10'}).setToken(process.env.TOKEN)

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
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
            body: commands,
        });
    } catch (err) {
        console.log(err);
    }
}

exports.data = methods;

