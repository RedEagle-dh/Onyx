const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const { getUserJoinedEmbed } = require("../../messages/embeds/embedHandler")
require("dotenv").config({path: "../../.env"});
module.exports = {
    name: "guildMemberAdd",
    async execute(member, redisClient) {
        if (await featureIsUnlocked(member.guild.id, "serverstats", redisClient)) {
            const privateServerId = process.env.SERVERID_PRIVATE;
            const mrFunLeagueBuildsId = process.env.SERVERID_MRFUNLEAGUEBUILDS;
            const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${member.guild.id}`));
            const logChannel = member.guild.channels.cache.find(c => c.id === jsonFile.logchannel);

            if (member.guild.id === privateServerId) {
                
                const role = member.guild.roles.cache.find(g => g.id === "756946278075596852");
                await member.roles.add(role);
                const channel = member.guild.channels.cache.find(c => c.id === "817413091704307712");
                await channel.edit({name: `👥 Members: ${member.guild.memberCount}`})
                await logChannel.send({embeds: [getUserJoinedEmbed(member)]})
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