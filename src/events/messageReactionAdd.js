const redisClient = require('../database/database');
module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user) {
        if (user.id === reaction.client.user.id) {
            return;
        }
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
                return;
            }
        }
        const polls = await redisClient.get(`polls-${reaction.message.guild.id}`);
        if (!polls) {
            return;
        }
        const pollsArray = JSON.parse(polls).polls;
        const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        for (const poll of pollsArray) {
            if (reaction.message.id === poll.messageId) {
                const message = reaction.message;
                const reactions = message.reactions.cache;
                const results = [];
                for (let i = 0; i < reactions.size; i++) {
                    const reaction = reactions.get(`${emotes[i]}`);
                    if (!reaction) continue;
                    results.push({answer: reaction.emoji.name, amount: reaction.count - 1});
                }
                results.sort((a, b) => b.amount - a.amount);
                const totalVotes = results.reduce((a, b) => a + b.amount, 0);
                const newEmbed = reaction.message.embeds[0];
                newEmbed.data.fields[1].value = totalVotes;
                await reaction.message.edit({embeds: [newEmbed]});
            }
        }
    }
}