const {
    SlashCommandBuilder,
    ActionRowBuilder,
    EmbedBuilder, ButtonBuilder
} = require("discord.js");
const {ButtonStyle} = require("discord-api-types/v10");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("voiceedit")
        .setDescription("Sending a message for editing a custom voice channel")
    ,
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "customchannels", redisClient)) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const eb = new EmbedBuilder().setColor("#2F3136").setTitle("<:happyahri:888323873815298058> Edit your custom voice channel")
            .setDescription("Edit your custom voice channel your are currently connected to.\n\nYou can set the maximum amount of users and the name of your voice channel.\n\n\n:warning: **Your can only edit the channel name 3 times in a row!**")
        const ActionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel("Edit Channel").setEmoji("🔧").setStyle(ButtonStyle.Secondary).setCustomId("editvoice"),
            //new ButtonBuilder().setLabel("Lock").setEmoji("🔒").setStyle(ButtonStyle.Danger).setCustomId("lockvoice"),
            //new ButtonBuilder().setLabel("Unlock").setEmoji("🔓").setStyle(ButtonStyle.Success).setCustomId("unlockvoice")
        )
        event.editReply({content: "Done"})
        event.channel.send(({embeds: [eb], components: [ActionRow]}))
    }

}