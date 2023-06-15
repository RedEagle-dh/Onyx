const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    StringSelectMenuOptionBuilder, EmbedBuilder
} = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../messages/embeds/embedHandler");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("voicecreation")
        .setDescription("Sending a message for voicecreation")
    ,
    async execute(event, redisClient) {
        if (!await featureIsUnlocked(event.guild.id, "customchannels", redisClient)) {
            event.reply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const channel = event.channel;
        const voices = await redisClient.keys(`voice-${event.guild.id}-*`).catch((err) => {
            eb.setColor("Red").addFields({
                name: ":x: Database error",
                value: `\`\`\`${err.message}\`\`\``,
                inline: true
            })
            event.editReply({embeds: [eb], ephemeral: true});
        });
        const result = [];
        if (voices.length === 0) {
            const eb = new EmbedBuilder()
                .addFields({
                    name: ":x: No voice channels found!",
                    value: "Please create a voice channel category first!",
                    inline: false
                })
                .setColor("Red");
            event.editReply({embeds: [eb], ephemeral: true});
            return;
        }
        for (let i = 0; i < voices.length; i++) {
            result.push(JSON.parse(await redisClient.get(voices[i])));
        }


        const actionRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder().setCustomId("voicecreation").addOptions(
                ...getSelectMenuOptions(result)
            ).setMaxValues(1)
        )

        const eb = new EmbedBuilder()
            .setTitle("<:happyahri:888323873815298058> Create a custom voice channel")
            .setDescription(`\u200b\n**3 Steps to be happy**\n\nStep 1: Be in a voice channel.\nStep 2: Select a voice genre from the select-menu.\nStep 3: Be in **your** voice channel`)
            .setColor("#2F3136");
        channel.send({embeds: [eb], components: [actionRow]});


        await event.editReply({
            embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                name: ":white_check_mark: Menu sent!",
                value: "Select-menu sent to this channel!",
                inline: true
            })], ephemeral: true
        });
    }
}


function getSelectMenuOptions(result) {
    const list = [];
    result.forEach(row => {
        let max = row.maxmembers;
        if (max === "0") {
            max = "unlimited";
        }
        list.push(new StringSelectMenuOptionBuilder().setLabel(`${row.voicename}`).setDescription(`A Voice for ${row.voicename} with ${max} max. members`).setValue(`${row.voicename}`).setEmoji(`${row.emoji}`));
    })
    list.sort((a, b) => a.data.label.localeCompare(b.data.label));
    return list;
}