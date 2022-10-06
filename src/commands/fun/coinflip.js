const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flips a coin"),
    async execute(event) {
        const number = Math.floor(Math.random() * 2) + 1;
        if (number === 1) {
            event.editReply({content: "🪙 Heads"});
        } else {
            event.editReply({content: "<a:legocoin:1017933659031994378> Tails"});
        }
    }
}