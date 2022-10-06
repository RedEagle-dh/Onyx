const {
    SlashCommandBuilder, EmbedBuilder
} = require("discord.js");
const redisClient = require("../../database/database");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("functions")
        .setDescription("Lock/Unlock functions to a guild")
        .addSubcommand(subcommand => subcommand.setName("unlock").setDescription("Unlock a function to a guild")
            .addStringOption(option => option.setName("guildid").setDescription("The guild").setRequired(true))
            .addStringOption(option => option.setName("function").setDescription("The function").setRequired(true).addChoices(
                {
                    name: "Music",
                    value: "music"
                },
                {
                    name: "Birthday Calendar",
                    value: "birthday"
                },
                {
                    name: "Custom channels",
                    value: "customchannels"
                },
                {
                    name: "Server Stats",
                    value: "serverstats"
                },
                {
                    name: "Tournament Feature",
                    value: "tournamentfeature"
                },
                {
                    name: "Moderation",
                    value: "moderation"
                }
            )))
        .addSubcommand(subcommand => subcommand.setName("lock").setDescription("Lock a function to a guild")
            .addStringOption(option => option.setName("guildid").setDescription("The guild").setRequired(true))
            .addStringOption(option => option.setName("function").setDescription("The function").setRequired(true).addChoices(
                {
                    name: "Music",
                    value: "music"
                },
                {
                    name: "Birthday Calendar",
                    value: "birthday"
                },
                {
                    name: "Custom channels",
                    value: "customchannels"
                },
                {
                    name: "Server Stats",
                    value: "serverstats"
                },
                {
                    name: "Tournament Feature",
                    value: "tournamentfeature"
                },
                {
                    name: "Moderation",
                    value: "moderation"
                }
            )))
    ,
    async execute(event) {
        if (event.member.id !== "324890484944404480") {
            event.editReply({
                embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                    name: ":x: No permissions!",
                    value: `» **You are not allowed to use this command!**`,
                    inline: true
                })]
            })
            return;
        }
        const guildId = event.options.getString("guildid");
        const g = event.client.guilds.cache.find(g => g.id === guildId);
        if (g === null || g === undefined) {
            event.editReply({
                embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                    name: ":x: Invalid guild!",
                    value: `» **The guild is not valid!**`,
                    inline: true
                })]
            })
            return;
        }
        const functionToLock = event.options.getString("function");
        const functions = await redisClient.get("functionconfig");
        const jsonObj = JSON.parse(functions);
        switch (event.options.getSubcommand()) {
            case "unlock": {
                if (jsonObj[functionToLock].includes(guildId)) {
                    event.editReply({
                        embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                            name: ":x: Error!",
                            value: `» **The function is already unlocked!**`,
                            inline: true
                        })]
                    })
                    return;
                }
                switch (functionToLock) {
                    case "music": {
                        break;
                    }
                    case "birthday": {
                        await redisClient.set(`birthday-${guildId}`, JSON.stringify(Object({enabled: false, role: null, channel: null, dates: []})));
                        break;
                    }
                    case "customchannels": {
                        await redisClient.set(`serverconfig-${event.guild.id}`, JSON.stringify({
                            logchannel: "",
                            voicecategorychannel: "",
                            welcomechannel: "",
                            immunevoices: []
                        }));
                        break;
                    }
                    case "serverstats": {
                        break;
                    }
                    case "logs": {
                        break;
                    }
                    case "tournamentfeature": {
                        break;
                    }
                    case "moderation": {
                        await redisClient.set(`tempbans-${guildId}`, JSON.stringify(Object({bans: []})));
                    }
                }
                jsonObj[functionToLock].push(guildId);
                await redisClient.set(`functionconfig`, JSON.stringify(jsonObj))
                event.editReply({
                    embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                        name: ":white_check_mark: Sucess!",
                        value: `» **The function is unlocked now!**`,
                        inline: true
                    })]
                })
                break;
            }
            case "lock": {
                if (!jsonObj[functionToLock].includes(guildId)) {
                    event.editReply({
                        embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                            name: ":x: Error!",
                            value: `» **The function is already locked!**`,
                            inline: true
                        })]
                    })
                    return;
                }
                switch (functionToLock) {
                    case "music": {
                        break;
                    }
                    case "birthday": {
                        await redisClient.del(`birthday-${guildId}`);
                        break;
                    }
                    case "customchannels": {
                        await redisClient.del(`serverconfig-${event.guild.id}`);
                        break;
                    }
                    case "serverstats": {
                        break;
                    }
                    case "logs": {
                        break;
                    }
                    case "tournamentfeature": {
                        break;
                    }
                    case "moderation": {
                        await redisClient.del(`tempbans-${guildId}`);
                    }
                }
                jsonObj[functionToLock].splice(jsonObj[functionToLock].indexOf(guildId), 1);
                await redisClient.set(`functionconfig`, JSON.stringify(jsonObj))
                event.editReply({
                    embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                        name: ":white_check_mark: Sucess!",
                        value: `» **The function is locked now!**`,
                        inline: true
                    })]
                })

                break;
            }
        }
    }
}