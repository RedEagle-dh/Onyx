const {
    SlashCommandBuilder, EmbedBuilder
} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("fetchusers")
        .setDescription("Fetching users to the database")
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
        await guild.members.fetch();
        const members = guild.members.cache;
        let fetchLog = "";
        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
            name: ":satellite_orbital: Fetching users...",
            value: `» **Please wait...**`,
            inline: true
        });
        event.editReply({embeds: [eb]});
        members.forEach(member => {
            if (member !== null && member !== undefined) {
                const val = redisClient.get(`${guild.id}-${member.id}`);
                val.then((d) => {
                    if (d === null) {
                        const json = Object({userid: member.id, messagecount: 0, voiceseconds: 0, invoicesince: 0});
                        redisClient.set(`${guild.id}-${member.id}`, JSON.stringify(json));
                        fetchLog += `:white_check_mark: ${member.user.tag} (${member.id})\n`;
                    }
                })
            }
        })

        setTimeout(() => {
            const newEb = new EmbedBuilder().setColor("#2F3136").addFields({
                name: ":white_check_mark: Users fetched!",
                value: `${members.size} users fetched successfully!`,
                inline: false
            });

            event.editReply({embeds: [newEb]});
        }, 10000)
    }
}