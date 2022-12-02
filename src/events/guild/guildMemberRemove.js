const redisClient = require("../../database/database");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {EmbedBuilder} = require("discord.js");
module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        if (await featureIsUnlocked(member.guild.id, "serverstats")) {
            if (member.guild.id === process.env.SERVERID_PRIVATE) {
                const channel = member.guild.channels.cache.find(c => c.id === "817413091704307712");
                channel.setName(`Members: ${member.guild.memberCount}`)
            }
            if (member.guild.id === process.env.SERVERID_MRFUNLEAGUEBUILDS) {
                const channel = member.guild.channels.cache.find(c => c.id === "891314534839648296");
                await channel.edit({name: `👥 Members: ${member.guild.memberCount}`})
            }
        }
        const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${member.guild.id}`));
        redisClient.del(`${member.guild.id}-${member.user.id}`);
        let log = member.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1
        });
        if (fetchedLogs.entries.first().createdAt.getTime() < Date.now()) {
            const eb = new EmbedBuilder().setColor("Red");
            eb.setColor("Red").setTitle(":wave: Member left").setDescription(`${member.user.tag} (${member}) left the server`)
                .addFields({
                        name: "User",
                        value: `${member} (${member.user.tag})`,
                        inline: false
                    },
                    {
                        name: "Create Date",
                        value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:d> (<t:${Math.round(member.user.createdTimestamp / 1000)}:R>)`,
                        inline: false
                    },
                    {
                        name: "Join Date",
                        value: `<t:${Math.round(member.joinedTimestamp / 1000)}:d> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`,
                        inline: false
                    }).setThumbnail(member.user.displayAvatarURL())
                .setFooter({text: "User ID: " + member.id}).setTimestamp();
            try {
                log.send({embeds: [eb]});
            } catch (e) {
                console.log("JSON Error: Log Channel is set incorrectly or got deleted.")
            }
        }
        let reason = fetchedLogs.entries.first().reason;
        if (reason === null || reason === undefined || reason === "" || reason === " ") {
            reason = "No reason given"
        }
        // AuditLogEvent (Kick = 20), (ban = 22)
        if (fetchedLogs.entries.first().action === 20) {
            log = member.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
            const eb = new EmbedBuilder().setColor("#2F3136").setTitle(":exclamation: Member kicked").setDescription(`${member.user.tag} (${member}) was kicked`).setColor("Red")
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
                        name: "User IDs",
                        value: `\`\`\`ml\nUser = ${member.user.id}\nModerator = ${fetchedLogs.entries.first().executor.id}\`\`\``,
                        inline: false
                    }).setFooter({text: "User ID: " + member.id}).setTimestamp().setThumbnail(member.user.displayAvatarURL());
            try {
                log.send({embeds: [eb]});
            } catch (e) {
                console.log("JSON Error: Log Channel is set incorrectly or got deleted.")
            }
        } else if (fetchedLogs.entries.first().action === 22) {
            log = member.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
            const eb = new EmbedBuilder().setColor("#2F3136").setTitle(":no_entry: Member banned").setDescription(`${member.user.tag} (${member}) was banned`).setColor("Red")
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
                        name: "User IDs",
                        value: `\`\`\`ml\nUser = ${member.user.id}\nModerator = ${fetchedLogs.entries.first().executor.id}\`\`\``,
                        inline: false
                    }).setFooter({text: "User ID: " + member.id}).setTimestamp().setThumbnail(member.user.displayAvatarURL());
            try {
                log.send({embeds: [eb]});
            } catch (e) {
                console.log("JSON Error: Log Channel is set incorrectly or got deleted.")
            }
        }
    }
}