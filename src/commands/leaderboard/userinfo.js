require('dotenv').config({path: "../../.env"});

const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Information about a specific user")
        .addUserOption(option => option.setName("user").setDescription("The user to get information about").setRequired(false))
    ,
    async execute(event, redisClient) {
        const user = event.options.getUser("user");
        let member;
        if (user === undefined || user === null) {
            member = event.member;
        } else {
            member = event.guild.members.cache.find(u => u.id === user.id);
        }
        const jsonString = await redisClient.get(`${event.guild.id}-${member.id}`);
        const jsonObj = JSON.parse(jsonString);


        const voiceTimeSeconds = jsonObj.voiceseconds;
        const seconds = voiceTimeSeconds % 60;
        let minutes;
        if (voiceTimeSeconds / 60 >= 60) {
            minutes = Math.floor(voiceTimeSeconds /60 % 60);
        } else {
            minutes = Math.floor(voiceTimeSeconds / 60);
        }
        const numberWithCommas = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        const hours = Math.floor(voiceTimeSeconds / 60 / 60);
        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
                name: `:bust_in_silhouette: Information about ${member.user.tag}`,
                value: `» **Username:** ${member.user.username}\n» **Discriminator:** ${member.user.discriminator}\n» **ID:** ${member.user.id}\n» **Bot:** ${member.user.bot}`,
                inline: false,
            },
            {
                name: `:calendar: Account created`,
                value: `» **Created at:**\n<t:${Math.floor(member.user.createdTimestamp / 1000)}:d> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`,
                inline: true
            },
            {
                name: `:calendar: Joined the server`,
                value: `» **Joined at:**\n<t:${Math.floor(member.joinedAt / 1000)}:d> (<t:${Math.floor(member.joinedAt / 1000)}:R>)`,
                inline: true
            },
            {
                name: `\u200b`,
                value: `\u200b`,
                inline: true
            },
            {
                name: `:bar_chart: Messages`,
                value: `» ${numberWithCommas(jsonObj.messagecount)}`,
                inline: true
            },
            {
                name: `:hourglass: Voicetime`,
                value: `» ${hours}h ${minutes}m ${seconds}s`,
                inline: true
            }).setThumbnail(member.user.avatarURL()).setTimestamp().setFooter({
            text: `Requested by ${event.user.username}`, iconURL: event.user.avatarURL()
        });

        event.editReply({embeds: [eb]})
    }
}