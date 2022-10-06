const {SlashCommandBuilder} = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed, getBanEmbed} = require("../../functions/embedCreator");
const redisClient = require("../../database/database");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("tempban")
        .setDescription("Ban a user temporarily from the server")
        .addUserOption(option => option.setName("user").setDescription("The user").setRequired(true))
        .addStringOption(option => option.setName("duration").setDescription("The duration of the ban in h/d/w/m").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the ban").setRequired(true)
            .addChoices(
                {
                    name: "Scam",
                    value: "Scam"
                },
                {
                    name: "Advertising",
                    value: "Advertising"
                },
                {
                    name: "Discrimination",
                    value: "Discrimination"
                },
                {
                    name: "Spam",
                    value: "Spam"
                },
                {
                    name: "NSFW Content",
                    value: "NSFW Content"
                },
                {
                    name: "Other (Specify in the comment section)",
                    value: "Other (Specify in the comment section)"
                }))
        .addStringOption(option => option.setName("comment").setDescription("A comment for the ban").setRequired(false))
    ,
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "moderation")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const jsonObj = JSON.parse(await redisClient.get(`tempbans-${event.guild.id}`));
        const user = event.options.getUser("user");
        const duration = event.options.getString("duration");
        const reason = event.options.getString("reason");
        const comment = event.options.getString("comment");
        const number = duration.split(/(\d+)/)[1];
        const identifier = duration.split(/[0-9]/)[duration.length - 1];

        let unbandate;
        let durationForEmbed;
        if (identifier === "h") {
            unbandate = Date.now() + ((number * 3600) * 1000);
            durationForEmbed = `${number} hour(s)`;
        } else if (identifier === "d") {
            unbandate = Date.now() + ((number * 86400) * 1000);
            durationForEmbed = `${number} day(s)`;
        } else if (identifier === "w") {
            unbandate = Date.now() + ((number * 604800) * 1000);
            durationForEmbed = `${number} week(s)`;
        } else if (identifier === "y") {
            unbandate = Date.now() + ((number * 31557600) * 1000);
            durationForEmbed = `${number} year(s)`;
        } else if (identifier === "m") {
            unbandate = Date.now() + ((number * 2629800) * 1000);
            durationForEmbed = `${number} month(s)`;
        }
        let newReason;
        const currentDate = new Date();
        const newUnbanDate = new Date();
        console.log(unbandate)
        newUnbanDate.setTime(unbandate);
        console.log()
        if (!comment) {
            newReason = `${reason} | ${currentDate.toLocaleString().split(",")[0]} - ${newUnbanDate.toLocaleString().split(",")[0]} | ${event.user.tag}`;
        } else {
            newReason = `${reason} - ${comment} | ${currentDate.toLocaleString().split(",")[0]} - ${newUnbanDate.toLocaleString().split(",")[0]} | ${event.user.tag}`;
        }

        const member = await event.guild.members.cache.find(member => member.id === user.id);
        await member.ban({reason: newReason});
        jsonObj["bans"].push(Object({user: user.id, unbandate: unbandate, reason: reason, modid: event.user.id}));
        await redisClient.set(`tempbans-${event.guild.id}`, JSON.stringify(jsonObj));
        event.editReply({embeds: [getBanEmbed(user, durationForEmbed, reason, event.options.getString("comment"), event.user)], ephemeral: false});
    }
}