const { SlashCommandBuilder } = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../messages/embeds/embedHandler");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Use \\n to create a line break. Markdown and Mentions are supported except codeblocks.")
        .addStringOption(option => option.setName("msg").setDescription("The message to send").setRequired(true))
    ,
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "moderation", redisClient)) {
            event.editReply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const msg = event.options.getString("msg");
        event.editReply({content:"Message sent!", ephemeral: true});
        event.channel.send(msg.replaceAll("\\n", "\n"));
    }
}