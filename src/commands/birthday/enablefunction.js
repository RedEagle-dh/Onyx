const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Enable/Disable the birthday calendar")
        .addSubcommand(subcommand => subcommand.setName("enable").setDescription("Enable the birthday calendar").addRoleOption(option => option.setName("role").setDescription("The birthday role").setRequired(true)).addChannelOption(option => option.setName("channel").setDescription("The channel where the birthday message will be posted").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("disable").setDescription("Disable the birthday calendar"))
        .addSubcommand(subcommand => subcommand.setName("add").setDescription("Adding a new birthday").addUserOption(option => option.setName("member").setDescription("The member").setRequired(true)).addStringOption(option => option.setName("date").setDescription("The date of the birthday").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("remove").setDescription("Remove a birthday").addUserOption(option => option.setName("member").setDescription("The member").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("show").setDescription("Show your birthday or another member's birthday").addUserOption(option => option.setName("member").setDescription("The member").setRequired(false)))
    ,
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "birthday")) {
            event.editReply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const subcommand = event.options.getSubcommand();
        const eb = new EmbedBuilder().setColor("#2F3136");
        if (subcommand === "enable") {
            eb.addFields({
                name: ":white_check_mark: Done",
                value: "The birthday calendar is now enabled!\n",
                inline: true
            })
            const role = event.options.getRole("role");
            await redisClient.set(`birthday-${event.guild.id}`, JSON.stringify(Object({enabled: true, role: role.id, channel: event.options.getChannel("channel").id, dates: []})));
            event.editReply({content: `The birthday calendar is now enabled! The birthday role is ${role}.`, ephemeral: true});
        } else if (subcommand === "disable") {
            eb.addFields({
                name: ":white_check_mark: Done",
                value: "The birthday calendar is now disabled!",
                inline: true
            })
            await redisClient.del(`birthday-${event.guild.id}`);
            event.editReply({embeds: [eb], ephemeral: true});
        } else if (subcommand === "add") {
            const jsonObj = JSON.parse(await redisClient.get(`birthday-${event.guild.id}`))
            if (!jsonObj) return event.editReply({content: "The birthday calendar is not enabled!", ephemeral: true});
            const currentDates = jsonObj.dates;
            const member = event.options.getUser("member");
            const date = event.options.getString("date");
            const formattedDate = date.split(".").reverse().join(".");
            if (currentDates.find(d => d.user === member.id)) {
                eb.addFields({
                    name: ":x: Error",
                    value: "This member already has a birthday!",
                    inline: true
                })
                event.editReply({embeds: [eb], ephemeral: true});
                return;
            }
            currentDates.push({user: member.id, date: formattedDate});
            await redisClient.set(`birthday-${event.guild.id}`, JSON.stringify(Object({enabled: jsonObj.enabled, role: jsonObj.role, channel: jsonObj.channel, dates: currentDates})));
            eb.addFields({
                name: ":white_check_mark: Done",
                value: `The birthday of ${member} is now ${date}!`,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        } else if (subcommand === "remove") {
            const jsonObj = JSON.parse(await redisClient.get(`birthday-${event.guild.id}`))
            if (!jsonObj) return event.editReply({content: "The birthday calendar is not enabled!", ephemeral: true});
            const currentDates = jsonObj.dates;
            const user = event.options.getUser("member");
            if (!currentDates.find(d => d.user === user.id)) {
                eb.addFields({
                    name: ":x: Error",
                    value: "This user doesn't have a birthday!",
                    inline: true
                })
                event.editReply({embeds: [eb], ephemeral: true});
                return;
            }
            currentDates.splice(currentDates.findIndex(d => d.user === user.id), 1);
            await redisClient.set(`birthday-${event.guild.id}`, JSON.stringify(Object({enabled: jsonObj.enabled, role: jsonObj.role, channel: jsonObj.channel, dates: currentDates})));
            eb.addFields({
                name: ":white_check_mark: Done",
                value: `The birthday of ${user} is now removed!`,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        } else if (subcommand === "show") {
            const jsonObj = JSON.parse(await redisClient.get(`birthday-${event.guild.id}`))
            if (!jsonObj) return event.editReply({content: "The birthday calendar is not enabled!", ephemeral: true});
            const currentDates = jsonObj.dates;
            const user = event.options.getUser("member") || event.user;
            if (!currentDates.find(d => d.user === user.id)) {
                eb.addFields({
                    name: ":x: Error",
                    value: "This user doesn't have a birthday!",
                    inline: true
                })
                event.editReply({embeds: [eb], ephemeral: true});
                return;
            }

            const birthdayDate = Date.parse(currentDates.find(d => d.user === user.id).date);
            const daysUntil = Math.floor((birthdayDate - new Date()) / 1000 / 60 / 60 / 24);
            const formattedDaysUntil = Math.floor((birthdayDate / 1000));
            eb.addFields({
                name: "<a:birthday:1017882475344703529> Birthday of " + user.username,
                value: `The birthday of ${user} is <t:${formattedDaysUntil}:d>! Only ${daysUntil} days left!`,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        }
    }
}