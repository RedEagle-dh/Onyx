const {featureIsUnlocked} = require("../../functions/OuterFunctions");

require("dotenv").config({path: "../../.env"});
module.exports = {
    name: "guildMemberLeave",
    async execute(member, redisClient) {
        if (await featureIsUnlocked(member.guild.id, "serverstats", redisClient)) {
            if (member.guild.id === process.env.SERVERID_PRIVATE) {
                const channel = member.guild.channels.cache.find(c => c.id === "817413091704307712");
                channel.setName(`👥 Members: ${member.guild.memberCount}`)
            }
            if (member.guild.id === process.env.SERVERID_MRFUNLEAGUEBUILDS) {
                const channel = member.guild.channels.cache.find(c => c.id === "891314534839648296");
                await channel.edit({name: `👥 Members: ${member.guild.memberCount}`})
            }
        }
    }
}