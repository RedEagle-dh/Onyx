const {
    SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder
} = require("discord.js");
const redis = require("redis");
const {ButtonStyle} = require("discord-api-types/v10");
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: 6379
    },
    password: process.env.REDIS_PASSWORD
})
module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset")
        .setDescription("Resetting user in the database")
        .addUserOption(option => option.setName("user").setDescription("The user to reset").setRequired(false))
    ,
    async execute(event) {
        if (event.member.id !== "324890484944404480") {
            event.reply({embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                    name: ":x: No permissions!",
                    value: `» **You are not allowed to use this command!**`,
                    inline: true
                })]})
            return;
        }
        const user = event.options.getUser("user");
        let member;
        if (user === undefined || user === null) {
            member = event.member;
        } else {
            member = event.guild.members.cache.find(u => u.id === user.id);
        }


        const eb = new EmbedBuilder().setColor("Red").addFields({
            name: ":warning: Are you sure?",
            value: `Do you really want to reset the stats of ${member.user.tag} (${member})?\nThis can not be undone!`,
            inline: true
        });
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("reset")
                    .setLabel("Reset")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                new ButtonBuilder()
                    .setCustomId("cancelreset")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("❌")
            )
        event.editReply({embeds: [eb], components: [actionRow]});
    }
}