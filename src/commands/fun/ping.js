const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const redisClient = require("../../database/database")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    async execute(event) {
        const timer = new Date();
        let timer2;
        const clientPing = Date.now() - event.createdTimestamp;
        redisClient.ping().then(() => {
            timer2 = new Date();
            const redisPing = timer2 - timer;
            const eb = new EmbedBuilder().setColor("#2F3136").setTitle("🛰️ Pong...").setDescription(`> 🤖 **Client:** ${clientPing}ms
        \n> <:slashcommand:1017901608299921491> **API:** ${Math.round(event.client.ws.ping)}ms
        \n> <:database:1017902111851294761> **Database:** ${redisPing}ms`);
            event.editReply({embeds: [eb], ephemeral: true});
        })
    }
}