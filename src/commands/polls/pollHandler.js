const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {featureIsUnlocked} = require("../../functions/OuterFunctions");
const {functionLockedEmbed} = require("../../functions/embedCreator");
const redisClient = require("../../database/database");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create some amazing polls for your server!")
        .addSubcommand(subcommand => subcommand.setName("create").setDescription("Create a poll")
            .addChannelOption(option => option.setName("channel").setDescription("The channel in which you want to have the poll").setRequired(true))
            .addStringOption(option => option.setName("title").setDescription("The title of the poll").setRequired(true))
            .addStringOption(option => option.setName("description").setDescription("The description of the poll").setRequired(true))
            .addIntegerOption(option => option.setName("amountofanswers").setDescription("The amount of specific answers for the poll").setRequired(true))
            .addStringOption(option => option.setName("answers").setDescription("The answers separated with \",\"!").setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName("end").setDescription("End a poll")
            .addStringOption(option => option.setName("pollid").setDescription("The id of the poll").setRequired(true))
            .addBooleanOption(option => option.setName("share").setDescription("Whether you want to share the result or not").setRequired(true))
        ),
    async execute(event) {
        if (!await featureIsUnlocked(event.guild.id, "polls")) {
            event.editReply({embeds: [functionLockedEmbed()], ephemeral: true})
            return;
        }
        const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        const subcommand = event.options.getSubcommand();
        if (subcommand === "create") {
            const channel = event.options.getChannel("channel");
            const title = event.options.getString("title");
            const description = event.options.getString("description");
            const amountOfAnswers = event.options.getInteger("amountofanswers");
            const answers = event.options.getString("answers").split(",");
            if (answers.length > 10) {
                return event.editReply({content: "You can only have 10 answers!", ephemeral: true});
            }
            if (answers.length < amountOfAnswers) {
                return event.editReply({
                    content: "You can't have more answers than you have specified!",
                    ephemeral: true
                });
            }

            const eb = new EmbedBuilder().setColor("#2F3136");
            const polls = JSON.parse(await redisClient.get(`polls-${event.guild.id}`));
            const pollIds = [];
            for (const poll of polls.polls) {
                if (poll.title === title) {
                    eb.setTitle("Error");
                    eb.setDescription("There is already a poll with this title!");
                    event.editReply({embeds: [eb], ephemeral: true});
                    return;
                }
                if (poll.id !== undefined) {
                    pollIds.push(poll.id);
                }
            }
            if (pollIds.length === 0) {
                pollIds.push(0);
            }
            const newId = Math.max.apply(null, pollIds) + 1;
            eb.setTitle(title).setDescription(description)
                .setFooter({text: "Poll-ID: " + newId, iconUrl: event.client.user.avatarURL})
                .addFields({
                        name: "Answers",
                        value: `${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n")}`,
                        inline: true
                    },
                    {
                        name: "Votes",
                        value: "0",
                        inline: true
                    });

            const poll = await channel.send({embeds: [eb]});
            event.editReply({content: `The poll has been created! You can find it here: ${poll.url}`, ephemeral: true});

            polls.polls.push({title: title, id: newId, messageId: poll.id, channelId: poll.channel.id, messageLink: poll.url});
            await redisClient.set(`polls-${event.guild.id}`, JSON.stringify(polls));

            for (let i = 0; i < amountOfAnswers; i++) {
                await poll.react(`${emotes[i]}`);
            }

        } else if (subcommand === "end") {
            const pollId = event.options.getString("pollid");
            const share = event.options.getBoolean("share");
            const polls = JSON.parse(await redisClient.get(`polls-${event.guild.id}`));
            let pollJson;
            for (const poll of polls.polls) {
                if (poll.id === Number(pollId)) {
                    pollJson = poll;
                    break;
                }
            }

            if (!pollJson) {
                return event.editReply({content: "The poll couldn't be found!", ephemeral: true});
            }
            const channelId = pollJson.channelId;
            const messageId = pollJson.messageId;
            const channel = event.client.channels.cache.find(c => c.id === channelId);
            await channel.messages.fetch();
            const message = await channel.messages.fetch(messageId);
            const reactions = message.reactions.cache;
            const results = [];
            for (let i = 0; i < reactions.size; i++) {
                const reaction = reactions.get(`${emotes[i]}`);
                if (!reaction) continue;
                results.push({answer: reaction.emoji.name, amount: reaction.count - 1});
            }
            results.sort((a, b) => b.amount - a.amount);
            const resultEmbed = new EmbedBuilder()
                .setColor("#2F3136")
                .setTitle(`Results of the poll ${message.embeds[0].title}`)
                .setDescription(`${message.embeds[0].description} \n\n${results.map(result => result.answer + " " + result.amount).join("\n")}`)
            await event.editReply({embeds: [resultEmbed]});
            if (share) {
                await message.edit({embeds: [resultEmbed]});
            } else {
                await message.delete();
            }
            await message.reactions.removeAll();
            polls.polls.splice(polls.polls.indexOf(pollJson), 1);
            await redisClient.set(`polls-${event.guild.id}`, JSON.stringify(polls));
        }
    }
};