const {InteractionType, ChannelType} = require("discord-api-types/v10");
const {EmbedBuilder, PermissionsBitField} = require("discord.js");
const {errorInformation, voiceAction, fatalError, modCommands, adminCommands, botDevCommands, memberCommands, nitroCommands, botFunctions} = require("../../messages/embeds/embedHandler");
const {resolveButton} = require("../../functions/resolveFunctions");
const {getUserFromMention} = require("../../functions/OuterFunctions");
module.exports = {
    name: "interactionCreate",
    async execute(event, redisClient, client, __Log) {
        const command = client.commands.get(event.commandName);
        switch (event.type) {
            case InteractionType.MessageComponent: {
                if (event.type === InteractionType.MessageComponent) {
                    switch (event.customId) {
                        case "ticketselection": {
                            const value = event.values[0];
                            const jsonObj = JSON.parse(await redisClient.get(`serverconfig-${event.guild.id}`));
                            const supportChannelId = jsonObj.supportchannel;
                            const channel = event.guild.channels.cache.find(c => c.id === supportChannelId);
                            const role = event.guild.roles.cache.find(r => r.id === jsonObj.supportrole);
                            if (channel === undefined || channel === null) {
                                await event.reply({
                                    content: "The support channel is not set up yet. Please contact the server owner.",
                                    ephemeral: true
                                });
                                return;
                            }
                            await channel.threads.create({
                                name: `${value}-${event.user.username}`,
                                autoArchiveDuration: 1440,
                                reason: `Ticket created by ${event.user.tag}`,
                            }).then(async (thread) => {
                                await thread.send(`Hi ${event.member}! Please describe your problem here. A staff member will be with you shortly.`);
                                await thread.send(`${role}`).then(async (msg) => {
                                    msg.delete();
                                })
                            })

                            break;
                        }
                        case "rollenauswahl": {
                            const values = event.values;
                            const member = event.member;
                            for (const value of values) {
                                const jsonObj = JSON.parse(await redisClient.get(`roleselection-${event.guild.id}-${value}`));
                                const role = member.guild.roles.cache.find(r => r.id === jsonObj.roleid);
                                if (member.roles.cache.some(r => r.id === role.id)) {
                                    member.roles.remove(role);
                                } else {
                                    member.roles.add(role);
                                }

                            }
                            event.deferUpdate();
                            break;
                        }
                        case "help": {
                            switch (event.values[0]) {
                                case "functions": {
                                    event.update({embeds: [botFunctions(client)], components: [event.message.components[0]]});
                                    break;
                                }
                                case "botdev": {
                                    event.update({embeds: [botDevCommands()], components: [event.message.components[0]]});
                                    break;
                                }
                                case "moderation": {
                                    event.update({embeds: [modCommands()], components: [event.message.components[0]]});
                                    break;
                                }
                                case "admin": {
                                    event.update({embeds: [adminCommands()], components: [event.message.components[0]]});
                                    break;
                                }
                                case "nitro": {
                                    event.update({embeds: [nitroCommands()], components: [event.message.components[0]]});
                                    break;
                                }
                                case "general": {
                                    event.update({embeds: [memberCommands()], components: [event.message.components[0]]});
                                    break;
                                }
                            }
                            break;
                        }
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                        case "5": {
                            if (event.message.embeds[0].data.description === "Select a song to skip the current one and play your selection") {

                                event.update({
                                    components: [],
                                    embeds: [new EmbedBuilder().setColor("#2F3136").setTitle("🔍 Searching and skipping...").setDescription("Please wait....").setThumbnail("https://imgur.com/QnkFrG3")]
                                });
                                await resolveButton(event);
                            } else {
                                event.update({
                                    components: [],
                                    embeds: [new EmbedBuilder().setColor("#2F3136").setTitle("🔍 Searching...").setDescription("Please wait...").setThumbnail("https://imgur.com/QnkFrG3")]
                                });
                                await resolveButton(event);
                            }
                            break;
                        }
                        case "reset": {
                            if (event.member.id !== "324890484944404480") {
                                event.reply("You can't reset a user.", true)
                                return;
                            }
                            event.deferUpdate();
                            const user = getUserFromMention(event.message.embeds[0].data.fields[0].value.split('(')[1].split(')')[0]);
                            await redisClient.set(`${event.guild.id}-${user.id}`, JSON.stringify(Object({
                                userid: user.id,
                                messagecount: 0,
                                voiceseconds: 0,
                                invoicesince: 0
                            })));
                            const eb = new EmbedBuilder().setColor("#2F3136").addFields({
                                name: ":white_check_mark: Reset done!",
                                value: `${user.username} got reset!`,
                                inline: false
                            })
                            await event.message.delete()
                            break;
                        }
                        case "cancelreset": {
                            await event.message.delete()
                            break;
                        }
                        case "voicecreation": {
                            const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${event.guild.id}`));

                            if (jsonFile.voicecategorychannel === "") {
                                return;
                            }
                            await event.deferReply({ephemeral: true});
                            const voiceDoc = JSON.parse(await redisClient.get(`voice-${event.guild.id}-${event.values[0].toLowerCase().replaceAll(" ", "_")}`));

                            let role;
                            const clonesRole = event.guild.roles.cache.find(role => role.id === "756946278075596852") || event.guild.roles.cache.find(role => role.id === "1018879331679871077");
                            if (voiceDoc.roleid !== "everyone") {
                                role = event.guild.roles.cache.find(r => r.id === voiceDoc.roleid);

                                if (!role) {
                                    await event.editReply({embeds: [errorInformation("This role seems to be deleted. Please set a new role.")]})
                                    return;
                                }
                                if (event.member.roles.cache.find(r => r.id === role.id)) {
                                    if (event.member.voice.channel !== null) {

                                        event.guild.channels.create({
                                            name: `${event.values[0]} | ${event.member.displayName}`,
                                            type: ChannelType.GuildVoice,
                                            parent: jsonFile.voicecategorychannel,
                                            userLimit: Number(voiceDoc.maxmembers),
                                            permissionOverwrites: [
                                                {
                                                    id: event.guild.id,
                                                    deny: [PermissionsBitField.Flags.ViewChannel]
                                                },
                                                {
                                                    id: role,
                                                    allow: [PermissionsBitField.Flags.Connect]
                                                },
                                                {
                                                    id: clonesRole,
                                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                                    deny: [PermissionsBitField.Flags.Connect]
                                                }
                                            ]
                                        }).then(async (channel) => {
                                            await event.member.voice.setChannel(channel);
                                            await voiceAction(1, event.member, channel, redisClient);
                                            await event.editReply({
                                                embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                                                    name: ":white_check_mark: Channel Created",
                                                    value: `You have created a voice channel: ${channel}`,
                                                    inline: true
                                                })]
                                            });
                                        }).catch(async () => {
                                            await event.editReply({embeds: [fatalError("The bot must have the **manage channels** permission to create voice channels. Also the `voice-creation-category` must exist, make sure you selected the right category.")]});
                                        })
                                    } else {
                                        await event.editReply({
                                            embeds: [errorInformation("You have to be in a voice channel to create a voice channel")],
                                            ephemeral: true
                                        });
                                    }
                                } else {
                                    await event.editReply({
                                        embeds: [errorInformation("You need the role <@&" + role + "> to create this type of voice channel")],
                                        ephemeral: true
                                    });
                                }
                            } else {
                                if (event.member.voice.channel !== null) {
                                    event.guild.channels.create({
                                        name: `${event.values[0]} | ${event.member.displayName}`,
                                        type: ChannelType.GuildVoice,
                                        userLimit: Number(voiceDoc.maxmembers),
                                        parent: jsonFile.voicecategorychannel,
                                        permissionOverwrites: [
                                            {
                                                id: event.guild.id,
                                                deny: [PermissionsBitField.Flags.ViewChannel]
                                            },
                                            {
                                                id: clonesRole,
                                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                                            }
                                        ]
                                    }).then(async (channel) => {
                                        await event.member.voice.setChannel(channel);
                                        await voiceAction(1, event.member, channel, redisClient);
                                        await event.editReply({
                                            embeds: [new EmbedBuilder().setColor("#2F3136").addFields({
                                                name: ":white_check_mark: Channel Created",
                                                value: `You have created a voice channel: ${channel}`,
                                                inline: true
                                            })]
                                        });
                                    }).catch(async () => {
                                        await event.editReply({embeds: [fatalError("The bot must have the **manage channels** permission to create voice channels. Also the `voice-creation-category` must exist, make sure you selected the right category.")]});
                                    })
                                } else {
                                    event.editReply({
                                        embeds: [errorInformation("You have to be in a voice channel to create a voice channel")],
                                        ephemeral: true
                                    });
                                }
                            }
                            break;
                        }
                        case "unlockvoice": {
                            break;
                        }
                        case "lockvoice": {
                            break;
                        }
                        case "editvoice": {
                            const member = event.member;
                            const voiceChannel = member.voice.channel;
                            if (!voiceChannel) {
                                const eb = new EmbedBuilder()
                                    .addFields({
                                        name: ":x: You are not in a voice channel!",
                                        value: "Please join a voice channel first!",
                                        inline: false
                                    })
                                    .setColor("Red");
                                event.reply({embeds: [eb], ephemeral: true});
                                return;
                            }
                            const jsonFile = JSON.parse(await redisClient.get(`serverconfig-${event.guild.id}`));
                            if (voiceChannel.parent.id === jsonFile.voicecategorychannel && jsonFile.immunevoices.includes(voiceChannel.id)) {
                                const eb = new EmbedBuilder()
                                    .addFields({
                                        name: ":x: You are in a custom voice channel!",
                                        value: "Please join a normal voice channel first!",
                                        inline: false
                                    })
                                    .setColor("Red");
                                event.reply({embeds: [eb], ephemeral: true});

                            } else if (voiceChannel.parent.id === jsonFile.voicecategorychannel && !jsonFile.immunevoices.includes(voiceChannel.id)) {
                                let userLimit = voiceChannel.userLimit;
                                if (userLimit === 0) {
                                    userLimit = "Infinity";
                                }
                                const modal = new Modal()
                                    .setCustomId("editvoicemodal")
                                    .setTitle(`Settings for ${voiceChannel.name}`)
                                    .addComponents(
                                        new TextInputComponent()
                                            .setCustomId("channelname")
                                            .setLabel("Voice Channel Name")
                                            .setStyle("SHORT")
                                            .setPlaceholder(`${voiceChannel.name}`)
                                            .setRequired(false),
                                        new TextInputComponent()
                                            .setCustomId("maxmembers")
                                            .setLabel("Maximum Members")
                                            .setStyle("SHORT")
                                            .setPlaceholder(`${userLimit}`)
                                            .setRequired(false),
                                    );
                                await showModal(modal, {
                                    client: client,
                                    interaction: event
                                })
                            }
                            break;
                        }
                    }
                }
                break;
            }
            case !InteractionType.ApplicationCommand: {
                if (event.commandName !== "register" && event.commandName !== "edit") return;
            }
        }
        switch (event.commandName) {
            case "say":
            case "voicecreation": {
                await event.deferReply({ephemeral: true});
                break;
            }
        }
        if (event.commandName !== "clearmsg"
            && event.commandName !== "edit"
            && event.commandName !== "voicecreation"
            && event.commandName !== "setchannel"
            && event.commandName !== "say"
            && event.commandName !== "eval"
            && !event.customId
            && event.commandName !== "help"
            && event.commandName !== "play") {
            await event.deferReply();
        }
        if (command && event.type) {
            try {
                __Log.debug(`${event.guild.name} | ${event.user.username} used /${event.commandName}`)
                await command.execute(event, redisClient);
            } catch (error) {
                __Log.error(error);

                    if (event.deferred) {
                        event.editReply({embeds: [new EmbedBuilder().setTitle(":x: Failure").setColor("#2e3036")
                                .setDescription("An error occurred while executing this command. Please try to correct your input. If the error is still there, contact the developer.")
                                .addFields({
                                    name: "Error message",
                                    value: `\`\`\`js\n${error.message}\`\`\``,
                                    inline: true
                                }).setTimestamp().setFooter({text: "Bot developer: redeagle."})], ephemeral: true});
                    } else {
                        event.reply({embeds: [new EmbedBuilder().setTitle(":x: Failure").setColor("#2e3036")
                                .setDescription("An error occurred while executing this command. Please try to correct your input. If the error is still there, contact the developer.")
                                .addFields({
                                    name: "Error message",
                                    value: `\`\`\`js\n${error.message}\`\`\``,
                                    inline: true
                                }).setTimestamp().setFooter({text: "Bot developer: redeagle."})], ephemeral: true});
                    }
            }
        }

    }
}