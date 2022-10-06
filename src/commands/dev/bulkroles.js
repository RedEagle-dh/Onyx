const {
    SlashCommandBuilder, EmbedBuilder
} = require("discord.js");
const redisClient = require("../../database/database");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bulkroles")
        .setDescription("Giving roles to all users")
        .addSubcommand(subcommand => subcommand.setName("add").setDescription("Add a role to all users").addRoleOption(option => option.setName("role").setDescription("The role to add").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("remove").setDescription("Remove a role from all users").addRoleOption(option => option.setName("role").setDescription("The role to remove").setRequired(true)))
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
        const role = event.options.getRole("role");
        const guild = event.guild;
        await guild.members.fetch();
        const members = guild.members.cache;
        let fetchLog = "";
        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
            name: ":satellite_orbital: Parsing roles...",
            value: `» **Please wait...**`,
            inline: true
        });
        event.editReply({embeds: [eb]});
        if (event.options.getSubcommand() === "add") {
            members.forEach(member => {
                if (member !== null && member !== undefined) {
                    member.roles.add(role);

                }
            })
            const newEb = new EmbedBuilder().setColor("#2F3136").addFields({
                name: ":white_check_mark: Roles added",
                value: `${role} added to ${members.size} users!`,
                inline: false
            });
            event.editReply({embeds: [newEb]});
        } else {
            members.forEach(member => {
                if (member !== null && member !== undefined) {
                    member.roles.remove(role);
                }
            })
            const newEb = new EmbedBuilder().setColor("#2F3136").addFields({
                name: ":white_check_mark: Roles removed",
                value: `${role} removed from ${members.size} users!`,
                inline: false
            });
            event.editReply({embeds: [newEb]});
        }
    }
}