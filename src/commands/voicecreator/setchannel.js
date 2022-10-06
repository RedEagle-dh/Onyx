const {EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const redisClient = require("../../database/database")
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {replaceByValue} = require("../../functions/jsonCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setchannel")
        .setDescription("Sets the channel for different functions")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName("function").setDescription("The function you want to set the channel for")
            .addChoices(
                {
                    name: "Log Channel",
                    value: "logchannel"
                },
                {
                    name: "Voice Creation Category",
                    value: "voicecategorychannel"
                },
                {
                    name: "Welcome Channel",
                    value: "welcomechannel"
                },
                {
                    name: "Add Immune Voice",
                    value: "immunevoices"
                }
            )
            .setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("The channel you want to set").setRequired(true))

    ,
    async execute(event) {
        const functionName = event.options.getString("function");
        const channel = event.options.getChannel("channel");

        // channel.type 0 is text, 2 is voice, 4 is category
        const eb = new EmbedBuilder().setColor("#2F3136");
        const jsonObj = JSON.parse(await redisClient.get(`serverconfig-${event.guild.id}`));
        switch (functionName) {
            case "welcomechannel": {
                eb.addFields({
                    name: ":white_check_mark: Done",
                    value: `You set the channel for welcome messages.\nMessages will be sent in ${channel}`,
                    inline: true
                });
                redisClient.set(`serverconfig-${event.guild.id}`, JSON.stringify(replaceByValue(jsonObj, functionName, channel.id)));
                event.reply({embeds: [eb], ephemeral: true});
                break;
            }
            case "logchannel": {
                if (channel.type !== 0) {
                    eb.setFields({
                        name: ":x: Error",
                        value: "The channel you want to set is not a text channel!",
                        inline: true
                    })
                    event.reply({embeds: [eb], ephemeral: true});
                    return;
                }
                eb.addFields({
                    name: ":white_check_mark: Done",
                    value: `You set the channel for logging events.\nMessages will be sent in ${channel}`,
                    inline: true
                });
                redisClient.set(`serverconfig-${event.guild.id}`, JSON.stringify(replaceByValue(jsonObj, functionName, channel.id)));
                event.reply({embeds: [eb], ephemeral: true});
                break;
            }
            case "voicecategorychannel": {
                if (channel.type !== 4) {
                    eb.setFields({
                        name: ":x: Error",
                        value: "The channel you want to set is not a category!",
                        inline: true
                    })
                    event.reply({embeds: [eb], ephemeral: true});
                    return;
                }
                eb.addFields({
                    name: ":white_check_mark: Done",
                    value: `You set the category for custom voice channels.\nThe category is now ${channel}`,
                    inline: true
                });
                redisClient.set(`serverconfig-${event.guild.id}`, JSON.stringify(replaceByValue(jsonObj, functionName, channel.id)));
                event.reply({embeds: [eb], ephemeral: true});
                break;

            }
            case "immunevoices": {
                if (channel.type !== 2) {
                    eb.setFields({
                        name: ":x: Error",
                        value: "The channel you want to set is not a voice channel!",
                        inline: true
                    })
                    event.reply({embeds: [eb], ephemeral: true});
                    return;
                }
                const newList = jsonObj.immunevoices;
                newList.push(channel.id);
                eb.addFields({
                    name: ":white_check_mark: Done",
                    value: `You updated the immunevoices.\nHere is a list of the current immune voices.\n\n${newList.map((id) => `•<#${id}>`).join("\n")}`,
                    inline: true
                });
                redisClient.set(`serverconfig-${event.guild.id}`, JSON.stringify(replaceByValue(jsonObj, functionName, channel.id)));
                event.reply({embeds: [eb], ephemeral: true});
                break;
            }
        }

    }
}