const { EmbedBuilder, Colors } = require("discord.js");

const voiceAction = async (action, member, channel, redisClient, client, __Log) => {
    const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${channel.guild.id}`))
    const log = channel.guild.channels.cache.find(c => c.id === jsonFile.logchannel);
    const eb = new EmbedBuilder();
    if (action === 1) {
        eb.setColor("Green").setTitle("🔊 Voice channel created").setDescription("A voice channel has been created.")
            .addFields({
                name: "Member",
                value: `${member}`,
                inline: true
            },
                {
                    name: "Voice channel",
                    value: `${channel}`,
                    inline: true
                }).setFooter({ text: "Made with ♡ by RedEagle#0400" }).setTimestamp();
    } else if (action === 2) {
        eb.setColor("Red").setTitle("🔇 Voice channel deleted").setDescription("A voice channel has been deleted because it was empty.")
            .addFields(
                {
                    name: "Voice channel name",
                    value: `${channel.name}`,
                    inline: true
                }).setFooter({ text: "Made with ♡ by RedEagle#0400" }).setTimestamp();


    }
    try {
        log.send({ embeds: [eb] });
    } catch (e) {
        __Log.error("JSON Error: Log Channel is set incorrectly or got deleted.")
    }

}


const errorInformation = (message) => {
    return new EmbedBuilder().addFields({
        name: ":x: Error",
        value: `${message}`,
        inline: true
    }).setColor("Red");
}

const fatalError = (message) => {
    return new EmbedBuilder().addFields({
        name: ":x: Fatal Error",
        value: `${message}`,
        inline: true
    }).setColor("Red");
}

const databaseError = (message) => {
    return new EmbedBuilder().addFields({
        name: ":x: Database Error",
        value: `${message}`,
        inline: true
    }).setColor("Red");
}

const botDevCommands = () => {
    return new EmbedBuilder().setTitle("Bot Developer Commands").setDescription("These commands are only for the bot developer.")
        .setColor("#0033cc").addFields({
            name: "<:database:1017902111851294761> Database Setup",
            value: "> `/fetchusers` - Loading all users to the database\n" +
                "> `/edit messages` - Editing the amount of messages from a user\n" +
                "> `/edit voicetime` - Editing the voicetime from a user\n" +
                "> `/reset` - Resetting a user\n" +
                "> `/eval` - Evaluating javascript code",
            inline: false
        })
}

const adminCommands = () => {
    return new EmbedBuilder().setTitle("Admin Commands").setDescription("These commands are only for the administrators.\n<:owner:1017858152227684435> Currently only available at the main server")
        .setColor("#cc0000").addFields(
            {
                name: "<:slashcommand:1017901608299921491> Utility",
                value: "> `/say` - Use \\n to create a line break. Codeblocks are not supported\n" +
                    "> `!say [Channel ID] [message]` - One-to-one message\n" +
                    "> `/setchannel` - Setting the channel for logs, voice creation, etc. <:owner:1017858152227684435>",
                inline: false
            },
            {
                name: "<a:google:1017862264147165219> Channel creation",
                value: "> `/addvoice` - Adding a voice category\n" +
                    "> `/removevoice` - Removing a voice category\n" +
                    "> `/voicecreation` - Sending the message for voicecreation\n" +
                    "> `/voiceedit` - Sending the message for editing the voicechannel",
                inline: false
            },
            {
                name: "<a:whiteverification:1019417451680764006> Role Selection",
                value: "> `/rradd` - Adding a role to the reaction system\n" +
                    "> `/rrremove` - Removing a role from the reaction system\n" +
                    "> `/rrshow` - Sending the message for the reaction role system",
                inline: false
            },
            {
                name: ":calendar: Birthday Calendar <:owner:1017858152227684435>",
                value: "> `/birthday add` - Adding a birthday to the calendar\n" +
                    "> `/birthday remove` - Removing a birthday from the calendar\n" +
                    "> `/birthday enable` - Enabling the Birthday const\n" +
                    "> `/birthday disable` - Disabling the Birthday const",
                inline: false
            })
}

const memberCommands = () => {
    return new EmbedBuilder().setTitle("Member Commands").setDescription("These commands are available for everyone.\n<:owner:1017858152227684435> Currently only available at selected servers")
        .setColor("#009933").addFields(
            {
                name: "<:slashcommand:1017901608299921491> Utility",
                value: "> `/help` - Shows this message\n" +
                    "> `/ping` - Shows the bot's ping\n" +
                    "> `/coinflip` - Flips a coin\n" +
                    "> `/roll` - Rolls a dice\n" +
                    "> `/randomnumber` - Give a random number\n",
                inline: false
            },
            {
                name: "<:stats:1017841129368072252> Stats",
                value: "> `/user` - Show your usercard or the card of another user\n" +
                    "> `/leaderboard messages` - Shows the ranking of the top 10 users with the most messages\n" +
                    "> `/leaderboard voicetime` - Shows the leaderboard of the top 10 voice users",
                inline: false
            },
            {
                name: ":calendar: Birthday Calendar <:owner:1017858152227684435>",
                value: "> `/birthday` - Shows a user's birthday",
                inline: false
            }
        )
}

const modCommands = () => {
    return new EmbedBuilder().setTitle("Moderator Commands").setDescription("These commands are only for the moderators.")
        .setColor("#ffcc00").addFields({
            name: "<:slashcommand:1017901608299921491> Utility",
            value: "> `/clearmsg` - Clearing a bunch of messages\n" +
                "> `/tempban` - Temporarily banning a user\n",
            inline: false
        })
}

const nitroCommands = () => {
    return new EmbedBuilder().setTitle("Nitro Booster Commands").setDescription("These commands are only for nitro boosters.")
        .setColor("#ff33cc").addFields({
            name: "Nothing yet",
            value: "I am working on it.",
            inline: false
        })
}

const botconsts = (client) => {
    return new EmbedBuilder().setTitle("Bot consts").setDescription("Here is a list of all bot consts.\n<:owner:1017858152227684435> Currently only available at selected servers")
        .setColor("#ffffff").addFields(
            {
                name: `${client.emojis.cache.find(e => e.id === "1017841129368072252")} Stats`,
                value: "`»` Recording the voicetime a user spends unmute in a non-afk channel\n" +
                    "`»` Recording the amount of messages a user sends\n" +
                    "`»` Serverstats about server-members and server-boosters <:owner:1017858152227684435>",
                inline: false
            },
            {
                name: "<a:google:1017862264147165219> Channel creation",
                value: "`»` Creating voice channels\n" +
                    "`»` Editing voice channels",
                inline: false
            },
            {
                name: "<a:whiteverification:1019417451680764006> Reaction Role",
                value: "`»` Adding/Removing roles to users on selecting from selectmenu\n",
                inline: false
            },
            {
                name: ":calendar: Birthday Calendar <:owner:1017858152227684435>",
                value: "`»` Birthday Calendar for users\n" +
                    "`»` Congratulate users on their birthday\n" +
                    "`»` Giving them a birthday role",
                inline: false
            })
}

const constLockedEmbed = () => {
    return new EmbedBuilder().setColor("#2F3136")
        .addFields([{
            name: `:x: This feature is locked`,
            value: `This feature is locked on this server. Please contact the developer to unlock it.`,
            inline: true
        }])
}

const getBanEmbed = (user, duration, reason, comment, mod) => {
    if (!comment) {
        comment = "No comment";
    }
    return new EmbedBuilder().setColor("#2F3136")
        .setAuthor({ name: `${user.tag} was banned for ${duration}.`, iconURL: user.displayAvatarURL() })
        .setDescription(`**Reason:** ${reason}\n**Comment:** ${comment}`)
        .setFooter({ text: `Banned by: ${mod.id}`, iconURL: mod.displayAvatarURL() }).setTimestamp()
}

const getUserRemovedEmbed = (reason, fetchedLogs, member) => {
    const eb = new EmbedBuilder().setColor("#2F3136").addFields({
        name: "Reason",
        value: reason,
        inline: true
    },
        {
            name: "Moderator",
            value: `${fetchedLogs.entries.first().executor} (${fetchedLogs.entries.first().executor.tag})`,
            inline: true
        },
        {
            name: "User IDs",
            value: `\`\`\`ml\nUser = ${member.user.id}\nModerator = ${fetchedLogs.entries.first().executor.id}\`\`\``,
            inline: false
        }).setFooter({ text: "User ID: " + member.id }).setTimestamp().setThumbnail(member.user.displayAvatarURL());

    // AuditLogEvent (Kick = 20), (ban = 22)
    if (fetchedLogs.entries.first().action === 20) {
        return eb.setTitle(":no_entry: Member banned").setDescription(`${member.user.tag} (${member}) was banned`).setColor("Red");
    } else {
        return eb.setTitle(":exclamation: Member kicked").setDescription(`${member.user.tag} (${member}) was kicked`).setColor("Red");
    }
}

const getUserLeftEmbed = (member) => {
    return new EmbedBuilder().setColor("Red").setTitle(":wave: Member left").setDescription(`${member.user.tag} (${member}) left the server`)
        .addFields({
            name: "User",
            value: `${member} (${member.user.tag})`,
            inline: false
        },
            {
                name: "Create Date",
                value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:d> (<t:${Math.round(member.user.createdTimestamp / 1000)}:R>)`,
                inline: false
            },
            {
                name: "Join Date",
                value: `<t:${Math.round(member.joinedTimestamp / 1000)}:d> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`,
                inline: false
            }).setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: "User ID: " + member.id }).setTimestamp();
}

const getUserJoinedEmbed = (member) => {
    return new EmbedBuilder().setColor(Colors.Green).setTitle(`:wave: Member joined`).setDescription(`${member.user.tag} (${member}) joined the server`)
        .addFields({
            name: "User",
            value: `${member} (${member.user.tag})`,
            inline: false
        },
            {
                name: "Create Date",
                value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:d> (<t:${Math.round(member.user.createdTimestamp / 1000)}:R>)`,
                inline: false
            },
            {
                name: "Join Date",
                value: `<t:${Math.round(member.joinedTimestamp / 1000)}:d> (<t:${Math.round(member.joinedTimestamp / 1000)}:R>)`,
                inline: false
            }).setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: "User ID: " + member.id }).setTimestamp();
}



module.exports = {
    voiceAction,
    errorInformation,
    fatalError,
    databaseError,
    modCommands,
    memberCommands,
    adminCommands,
    botDevCommands,
    botconsts,
    nitroCommands,
    constLockedEmbed,
    getBanEmbed,
    getUserRemovedEmbed,
    getUserLeftEmbed,
    getUserJoinedEmbed
}