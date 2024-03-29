const { EmbedBuilder } = require("discord.js");
const { featureIsUnlocked } = require("../../functions/OuterFunctions");
const { AuditLogEvent } = require("discord-api-types/v10");
module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember, redisClient, client, __Log) {
        if (await featureIsUnlocked(oldMember.guild.id, "moderation", redisClient)) {
            const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${oldMember.guild.id}`))
            let log = oldMember.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
            const eb = new EmbedBuilder();
            if (oldMember.nickname !== newMember.nickname) {
                const channel = client.channels.cache.get("1017601669699219517")
                const embed = new EmbedBuilder()
                    .setColor("#2F3136")
                    .setTitle("📝 Nickname Changed!")
                    .setDescription(`${oldMember.user.username} changed their nickname from ${oldMember.nickname} to ${newMember.nickname}`)
                    .setThumbnail(oldMember.user.avatarURL)
                    .setTimestamp()
                await channel.send({ embeds: [embed] })
            }
            if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
                const fetchedLogs = await newMember.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberUpdate
                });
                let reason = fetchedLogs.entries.first().reason;

                if (reason === null || reason === undefined || reason === "" || reason === " ") {
                    reason = "No reason given"
                }

                eb.setColor("Red").setTitle(":zipper_mouth: Member muted").setDescription(`${oldMember.user.tag} (${oldMember}) was muted`)
                    .addFields({
                        name: "Reason",
                        value: reason,
                        inline: true
                    },
                        {
                            name: "Moderator",
                            value: `${fetchedLogs.entries.first().executor} (${fetchedLogs.entries.first().executor.tag})`,
                            inline: true
                        },
                        {
                            name: "Muted until",
                            value: `<t:${Math.floor(newMember.communicationDisabledUntil.getTime() / 1000)}> (Unmute in: <t:${Math.round(newMember.communicationDisabledUntil.getTime() / 1000)}:R>)`,
                            inline: false
                        },
                        {
                            name: "User IDs",
                            value: `\`\`\`ml\nUserID = ${newMember.id}\nModerator = ${fetchedLogs.entries.first().executor.id}\`\`\``,
                            inline: false
                        })
                    .setFooter({ text: "User ID: " + oldMember.id }).setTimestamp();

                try {
                    log.send({ embeds: [eb] });
                } catch (e) {
                    __Log.error("JSON Error: Log Channel is set incorrectly or got deleted.")
                }

            } else if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
                const fetchedLogs = await newMember.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberUpdate
                });

                eb.setColor("Green").setTitle(":grinning: Member unmuted manually").setDescription(`${oldMember.user.tag} (${oldMember}) was unmuted by ${fetchedLogs.entries.first().executor.tag}`)
                    .addFields(
                        {
                            name: "Moderator",
                            value: `${fetchedLogs.entries.first().executor} (${fetchedLogs.entries.first().executor.tag})`,
                            inline: true
                        },
                        {
                            name: "User IDs",
                            value: `\`\`\`ml\nUser = ${newMember.id}\nModerator = ${fetchedLogs.entries.first().executor.id}\`\`\``,
                            inline: false
                        })
                    .setFooter({ text: "User ID: " + oldMember.id }).setTimestamp();
                try {
                    log.send({ embeds: [eb] });
                } catch (e) {
                    __Log.error("JSON Error: Log Channel is set incorrectly or got deleted.")
                }
            } else if (oldMember.premiumSince !== newMember.premiumSince) {
                try {
                    const boostedUsers = newMember.guild.members.cache.filter(member => member.roles.cache.find(r => r.name === "Server Booster"));
                    const boostedChannel = newMember.guild.channels.cache.find(c => c.id === "1017600666891468832");
                    boostedChannel.setName(`🎉 Boosters: ${boostedUsers.size}`);
                } catch (e) {
                    console.log(e);
                }

            }

        }
    }
}