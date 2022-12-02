const redisClient = require("../../database/database");
const {voiceAction} = require("../../functions/embedCreator");
const {EmbedBuilder} = require("discord.js");
const {stopRecordVoiceTime, recordVoiceTime} = require("../../functions/OuterFunctions");
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState, newState) {
        // Voice Stats
        const jsonString = await redisClient.get(`${newState.guild.id}-${newState.member.id}`);
        const jsonObj = JSON.parse(jsonString);
        const afkChannel = newState.guild.afkChannel;

        if (afkChannel !== null) {
            if (newState.member.voice.selfMute || newState.channelId === afkChannel.id) {
                if (jsonObj.invoicesince !== 0) {
                    await stopRecordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                }
            } else if (!newState.member.voice.selfMute && newState.channelId !== afkChannel.id) {
                if (newState.channelId === null) {
                    if (jsonObj.invoicesince !== 0) {
                        await stopRecordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                    }
                } else if (oldState.channelId === null) {
                    await recordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                } else if (newState.member.voice.channelId !== null) {
                    await recordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                }
            }
        } else {
            if (newState.member.voice.selfMute) {
                if (jsonObj.invoicesince !== 0) {
                    await stopRecordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                }
            } else if (!newState.member.voice.selfMute) {
                if (newState.channelId === null) {
                    if (jsonObj.invoicesince !== 0) {
                        await stopRecordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                    }
                } else if (oldState.channelId === null) {
                    await recordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                } else if (newState.member.voice.channelId !== null) {
                    await recordVoiceTime(redisClient, newState.guild.id, newState.member.id, jsonObj);
                }
            }
        }


        // Voice Creation
        if (newState.guild.id === "756943363093037076" || newState.guild.id === "888327579914862592") {
            const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${newState.guild.id}`));
            if (jsonFile.voicecategorychannel !== "") {
                if (oldState.channelId !== null) {
                    const log = oldState.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
                    if (oldState.channel.parent.id === jsonFile.voicecategorychannel) {
                        if (!jsonFile.immunevoices.includes(oldState.channelId)) {
                            if (oldState.channel.members.size === 0) {
                                await voiceAction(2, oldState.member, oldState.channel);
                                await oldState.channel.delete().catch((err) => {
                                    try {
                                        const eb = new EmbedBuilder().setColor("Red").addFields({
                                            name: ":x: Fatal Error",
                                            value: `Bot does not have enough permissions to delete the voice channel.\nError report:\`\`\`${err}\`\`\``,
                                            inline: true
                                        });
                                        log.send({embeds: [eb]});
                                    } catch (e) {
                                        console.log("JSON Error: Log Channel is set incorrectly or got deleted.")
                                        console.log("Fatal Error: Bot does not have enough permissions to delete the voice channel.\nBug report: " + err)
                                    }
                                })
                            }

                        }

                    }
                }
            }

        }
    }
}