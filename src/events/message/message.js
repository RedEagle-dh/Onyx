module.exports = {
    name: "messageCreate",
    async execute(message, redisClient) {
        if (message.content.startsWith("!say") && message.member.id !== "1002251457392820244") {
            const msg = message.content.split(" ")
            let newMsg = "";
            for (let i = 2; i < msg.length; i++) {
                newMsg += msg[i] + " ";
            }
            const channelId = msg[1];
            const channel = message.guild.channels.cache.find(c => c.id === channelId);

            await channel.send(newMsg).catch(err => {
                message.channel.send("You need to provide a valid channel id!")
            });
            await message.delete();
        }
        const jsonString = await redisClient.get(`${message.guild.id}-${message.member.id}`);
        const jsonObj = JSON.parse(jsonString);
        await redisClient.set(`${message.guild.id}-${message.member.id}`, JSON.stringify(Object({
            userid: message.member.id,
            messagecount: jsonObj.messagecount + 1,
            voiceseconds: jsonObj.voiceseconds,
            invoicesince: jsonObj.invoicesince
        }))).catch(err => console.log(err));
    }
}