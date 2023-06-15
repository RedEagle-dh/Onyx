const { featureIsUnlocked } = require("../../functions/OuterFunctions");
const { getUserRemovedEmbed, getUserLeftEmbed } = require("../../messages/embeds/embedHandler")
const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "guildMemberRemove",
    async execute(member, redisClient, client, __Log) {
        if (await featureIsUnlocked(member.guild.id, "serverstats", redisClient)) {
            if (member.guild.id === process.env.SERVERID_PRIVATE) {
                const channel = member.guild.channels.cache.find(c => c.id === "817413091704307712");
                channel.setName(`Members: ${member.guild.memberCount}`)
            }
            if (member.guild.id === process.env.SERVERID_MRFUNLEAGUEBUILDS) {
                const channel = member.guild.channels.cache.find(c => c.id === "891314534839648296");
                await channel.edit({ name: `👥 Members: ${member.guild.memberCount}` })
            }
        }
        const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${member.guild.id}`));
        redisClient.del(`${member.guild.id}-${member.user.id}`);
        let log = member.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1
        });
        if (fetchedLogs.entries.first().createdAt.getTime() < Date.now()) {
            try {
                log.send({ embeds: [getUserLeftEmbed(member)] });
            } catch (e) {
                __Log.error("JSON Error: Log Channel is set incorrectly or got deleted.")
            }
        }
        const reason = fetchedLogs.entries.first().reason;
        if (reason === null || reason === undefined || reason === "" || reason === " ") {
            reason = "No reason given"
        }
        
        log = member.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
        try {
            log.send({ embeds: [getUserRemovedEmbed(reason, fetchedLogs, member)] });
        } catch (e) {
            __Log.error("JSON Error: Log Channel is set incorrectly or got deleted.")
        }
    }
}