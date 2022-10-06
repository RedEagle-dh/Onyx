const {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evaluate javascript code")
        .addSubcommand(subcommand => subcommand.setName("invisible").setDescription("Evaluate javascript code inivisble").addStringOption(option => option.setName("code").setDescription("The code to evaluate").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("visible").setDescription("Evaluate javascript code visible").addStringOption(option => option.setName("code").setDescription("The code to evaluate").setRequired(true)))
    ,
    async execute(event) {
        const code = event.options.getString("code");
        if (event.member.id !== "324890484944404480") {
            const eb = new EmbedBuilder().setColor("Red").addFields({
                name: ":x: Error",
                value: "Only the bot owner is allowed to use this command.",
                inline: true
            })
            event.reply({embeds: [eb], ephemeral: true});
            return;
        }
        if (event.options.getSubcommand() === "invisible") {
            event.deferReply({ephemeral: true}).then(async () => {
                try {
                    const start = process.hrtime();
                    let evaled = eval(code)
                    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
                    if (evaled instanceof Promise) evaled = await evaled;
                    const stop = process.hrtime(start);
                    const est = ((stop[0] * 1e9) + stop[1]) / 1e6;
                    const ebValue = `The code was evaluated successfully!\n\n` +
                        `**Input**\`\`\`js\n${code}\`\`\`\n` +
                        `**Output**\`\`\`js\n${evaled}\`\`\``;
                    if (ebValue.length > 2000) {
                        const attachement = new AttachmentBuilder(Buffer.from(evaled), {name: "eval.txt"});
                        const newebValue = `The code was evaluated successfully!\n\n` +
                            `**Input**\`\`\`js\n${code}\`\`\`\n` +
                            `**Output**\`\`\`Too long to display. See the attachment for details.\`\`\``;
                        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
                            name: ":white_check_mark: Done",
                            value: newebValue,
                            inline: true
                        }).setFooter({text: `EST ${est}ms`}).setTimestamp();
                        event.editReply({embeds: [eb], files: [attachement]});
                    } else {
                        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
                            name: ":white_check_mark: Done",
                            value: ebValue,
                            inline: true
                        }).setFooter({text: `EST ${est}ms`}).setTimestamp();
                        event.editReply({embeds: [eb]});
                    }
                } catch (err) {
                    event.editReply({content: `An error occured while evaluating the code!\`\`\`js\n${err}\`\`\``});
                }
            });
        } else {
            event.deferReply({ephemeral: false}).then(async () => {
                try {
                    const start = process.hrtime();
                    let evaled = eval(code)
                    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
                    if (evaled instanceof Promise) evaled = await evaled;
                    const stop = process.hrtime(start);
                    const est = ((stop[0] * 1e9) + stop[1]) / 1e6;
                    const ebValue = `The code was evaluated successfully!\n\n` +
                        `**Input**\`\`\`js\n${code}\`\`\`\n` +
                        `**Output**\`\`\`js\n${evaled}\`\`\``;
                    if (ebValue.length > 2000) {
                        const attachement = new AttachmentBuilder(Buffer.from(evaled), {name: "eval.txt"});
                        const newebValue = `The code was evaluated successfully!\n\n` +
                            `**Input**\`\`\`js\n${code}\`\`\`\n` +
                            `**Output**\`\`\`Too long to display. See the attachment for details.\`\`\``;
                        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
                            name: ":white_check_mark: Done",
                            value: newebValue,
                            inline: true
                        }).setFooter({text: `EST ${est}ms`}).setTimestamp();
                        event.editReply({embeds: [eb], files: [attachement]});
                    } else {
                        const eb = new EmbedBuilder().setColor("#2F3136").addFields({
                            name: ":white_check_mark: Done",
                            value: ebValue,
                            inline: true
                        }).setFooter({text: `EST ${est}ms`}).setTimestamp();
                        event.editReply({embeds: [eb]});
                    }
                } catch (err) {
                    event.editReply({content: `An error occured while evaluating the code!\`\`\`js\n${err}\`\`\``});
                }
            });
        }
    }
}