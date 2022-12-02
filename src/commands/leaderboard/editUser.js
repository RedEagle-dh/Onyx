const {
    SlashCommandBuilder, EmbedBuilder
} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit")
        .setDescription("Editing a user")
        .addSubcommand(subcommand => subcommand.setName("voicetime").setDescription("Editing the voice time of a user")
            .addUserOption(option => option.setName("user").setDescription("The user to edit").setRequired(true))
            .addNumberOption(option => option.setName("seconds").setDescription("The seconds to add").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("messages").setDescription("Editing the messages of a user")
            .addUserOption(option => option.setName("user").setDescription("The user to edit").setRequired(true))
            .addNumberOption(option => option.setName("messages").setDescription("The messages to add").setRequired(true)))
    ,
    async execute(event, redisClient) {
        if (event.member.id !== "324890484944404480") {
            event.reply({embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                    name: ":x: No permissions!",
                    value: `» **You are not allowed to use this command!**`,
                    inline: true
                })]})
            return;
        }

        const guild = event.guild;
        const member = guild.members.cache.find(u => u.id === event.options.getUser("user").id);
        const eb = new EmbedBuilder().setColor("#2F3136");
        const numberWithCommas = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        if (event.options.getNumber("seconds") !== null && event.options.getNumber("seconds") !== undefined) {
            const seconds = event.options.getNumber("seconds");
            const jsonObj = JSON.parse(await redisClient.get(`${guild.id}-${member.id}`))
            const jsonString = JSON.stringify(Object({userid: jsonObj.userid, messagecount: jsonObj.messagecount, voiceseconds: seconds, invoicesince: jsonObj.invoicesince}));
            await redisClient.set(`${guild.id}-${member.id}`, jsonString);
            eb.addFields({
                name: ":white_check_mark: User edited!",
                value: `» **${member.user.tag}**'s voice time has been edited to **${numberWithCommas(seconds)}** seconds!`,
                inline: false
            })
        } else if (event.options.getNumber("messages") !== null && event.options.getNumber("messages") !== undefined) {
            const messages = event.options.getNumber("messages");
            const jsonObj = JSON.parse(await redisClient.get(`${guild.id}-${member.id}`))
            const jsonString = JSON.stringify(Object({userid: jsonObj.userid, messagecount: messages, voiceseconds: jsonObj.voiceseconds, invoicesince: jsonObj.invoicesince}));
            await redisClient.set(`${guild.id}-${member.id}`, jsonString);
            eb.addFields({
                name: ":white_check_mark: User edited!",
                value: `» **${member.user.tag}**'s message count has been edited to **${numberWithCommas(messages)}** messages!`,
                inline: false
            })
        }
        event.reply({embeds: [eb]});
    }
}