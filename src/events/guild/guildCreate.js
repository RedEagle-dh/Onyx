const deploy = require("../../deploycommands");
module.exports = {
    name: "guildCreate",
    async execute() {
        await deploy.data.deploycmd();
    }
}