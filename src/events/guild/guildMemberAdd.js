const redisClient = require("../../database/database");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
require("dotenv").config({path: "../../.env"});
module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        if (await featureIsUnlocked(member.guild.id, "serverstats")) {
            const privateServerId = process.env.SERVERID_PRIVATE;
            const mrFunLeagueBuildsId = process.env.SERVERID_MRFUNLEAGUEBUILDS;
            console.log(mrFunLeagueBuildsId);
            console.log(member.guild.id)
            if (member.guild.id === privateServerId) {
                const role = member.guild.roles.cache.find(g => g.id === "756946278075596852");
                await member.roles.add(role);
                const channel = member.guild.channels.cache.find(c => c.id === "817413091704307712");
                await channel.edit({name: `👥 Members: ${member.guild.memberCount}`})
            }
            if (member.guild.id === mrFunLeagueBuildsId) {
                const role = member.guild.roles.cache.find(g => g.id === "1018879331679871077");
                await member.roles.add(role);
                const channel = member.guild.channels.cache.find(c => c.id === "891314534839648296");
                await channel.edit({name: `👥 Members: ${member.guild.memberCount}`})
            }

            const json = Object({userid: member.user.id, messagecount: 0, voiceseconds: 0, invoicesince: 0});
            await redisClient.set(`${member.guild.id}-${member.user.id}`, JSON.stringify(json));
        }
    }
}