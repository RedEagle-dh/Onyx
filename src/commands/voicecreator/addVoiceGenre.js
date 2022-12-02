const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");
const {createVoiceSelectionDoc} = require("../../functions/jsonCreator");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addvoice")
        .setDescription("Adding a voice genre to the select-menu")
        .addStringOption(option => option.setName("voicename").setDescription("The prefix of the voice").setRequired(true))
        .addStringOption(option => option.setName("emoji").setDescription("The emoji you want to use").setRequired(true))
        .addIntegerOption(option => option.setName("maxmembers").setDescription("The maximum amount of members.").setRequired(false))
        .addRoleOption(option => option.setName("role").setDescription("The role which is allowed to create the voice channel").setRequired(false)),
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "customchannels")) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const eb = new EmbedBuilder().setColor("#2F3136");
        let emojiId;
        const voiceName = event.options.getString("voicename");
        const voiceNameFormatted = voiceName.toLowerCase().replace(/ /g, "_");
        let role = event.options.getRole("role");
        let formattedRoleName;
        let maxMembers = event.options.getInteger("maxmembers");
        let formattedMaxMembers = maxMembers;

        if (maxMembers === null || maxMembers === undefined || maxMembers === "" || maxMembers === " ") {
            maxMembers = 0;
            formattedMaxMembers = "infinity";
        }
        if (role === null || role === undefined || role === false) {
            role = "everyone";
            formattedRoleName = "everyone";
        } else {
            formattedRoleName = role;
            role = role.id;
        }

        try {
            emojiId = event.options.getString("emoji").split(":")[2].split(">")[0];
        } catch (e) {
            eb.addFields({
                name: ":x: Error",
                value: "The emoji is not valid. It must be a custom Emote from this discord server!",
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
            return;
        }
        await redisClient.set(`voice-${voiceNameFormatted}`, `${createVoiceSelectionDoc(voiceName, maxMembers, emojiId, role)}`).then(() => {
            eb.addFields({
                name: ":white_check_mark: Done",
                value: `${voiceName} added to the select-menu! The voice channel will have a maximum of ${formattedMaxMembers} members and ${formattedRoleName} will have access to it.`,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        }).catch((err) => {
            eb.setColor("Red").addFields({
                name: ":x: Database error",
                value: `\`\`\`${err.message}\`\`\``,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        })
    }
}

