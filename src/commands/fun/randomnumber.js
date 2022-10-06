const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("randomnumber")
        .setDescription("Get a random number between 0 and the number you provide")
        .addNumberOption(option => option.setName("min").setDescription("The minimum number").setRequired(true))
        .addNumberOption(option => option.setName("max").setDescription("The maximum number").setRequired(true))
    ,
    async execute(event) {
        const min = event.options.getNumber("min");
        const max = event.options.getNumber("max");
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        event.editReply({content: `🔮 Your random number is ${number}`});
    }
}