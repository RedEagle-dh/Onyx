const deploy = require("../deploycommands");
const {fatalError} = require("../functions/embedCreator");
const {successEmbed} = require("../functions/OuterFunctions");
module.exports = {
    name: "modalSubmit",
    async execute(event) {
        if (event.customId === "editvoicemodal") {
            await event.deferReply({ephemeral: true});
            let newMaxMembers = event.getTextInputValue("maxmembers");
            let newName = event.getTextInputValue("channelname");
            if (newMaxMembers !== null) {
                await event.member.voice.channel.setUserLimit(Number(newMaxMembers)).catch((err) => {
                    event.editReply({embeds: [fatalError("You exceeded the rate Limit. Please try again later")]})
                });
            }
            if (newName !== null) {
                await event.member.voice.channel.setName(newName).catch((err) => {
                    event.editReply({embeds: [fatalError("You exceeded the rate Limit. Please try again later")]})
                });
            }
            await event.editReply({embeds: [successEmbed("Channel edited successfully.")], ephemeral: true})
        }
    }
}