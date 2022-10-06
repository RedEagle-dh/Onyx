const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a dice")
        .addNumberOption(option => option.setName("sides").setDescription("The amount of sides the dice will have - If not specified, the dice will have 6 sides").setRequired(false)),
    async execute(event) {
        const sides = event.options.getNumber("sides");
        if (sides == null) {
            const number = Math.floor(Math.random() * 6) + 1;
            event.editReply({content: `🎲 You rolled ${number}`});
            return;
        }
        if (sides < 6) {
            event.editReply({content: "The dice must have at least 6 sides!", ephemeral: true});
            return;
        }
        const number = Math.floor(Math.random() * sides) + 1;
        event.editReply({content: `🎲 You rolled ${number}`});

    }
}