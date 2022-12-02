const {EmbedBuilder, ButtonBuilder} = require("discord.js");
const {ButtonStyle} = require("discord-api-types/v10");


function successEmbed(messagevalue) {
    return new EmbedBuilder().setColor("Green").addFields({name: ":white_check_mark: Success", value: `${messagevalue}`, inline: true});
}

function failVoiceEmbed() {
    return new EmbedBuilder().setColor("Red").addFields({name: ":x: Failure", value: "You have to be in a voice channel!", inline: true});
}

function failEmbed(messagevalue) {
    return new EmbedBuilder().setColor("Red").addFields({name: ":x: Failure", value: `${messagevalue}`, inline: true});
}

async function recordVoiceTime(redisClient, guildid, memberid, jsonObj) {
    await redisClient.set(`${guildid}-${memberid}`, JSON.stringify(Object({
        userid: memberid,
        messagecount: jsonObj.messagecount,
        voiceseconds: jsonObj.voiceseconds,
        invoicesince: Date.now()
    })));
}

async function stopRecordVoiceTime(redisClient, guildid, memberid, jsonObj) {
    const newSeconds = Date.now() - Number(jsonObj.invoicesince);
    const rightsekunden = newSeconds / 1000;
    const rounded = Math.round(rightsekunden);
    const newVoiceSeconds = jsonObj.voiceseconds + rounded;
    await redisClient.set(`${guildid}-${memberid}`, JSON.stringify(Object({
        userid: memberid,
        messagecount: jsonObj.messagecount,
        voiceseconds: newVoiceSeconds,
        invoicesince: 0
    })));
}

function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return mention.guild.users.cache.get(mention);
    }
}

function createButtons(result) {
    const btn = [];

    for (let i = 1; i <= result.length; i++) {
        btn.push(new ButtonBuilder()
            .setCustomId(`${i}`)
            .setEmoji(`${getLabel(i)}`)
            .setStyle(ButtonStyle.Primary)
        )
    }
    return btn;
}

function getLabel(i) {
    switch (i) {
        case 1:
            return "1️⃣";
        case 2:
            return "2️⃣";
        case 3:
            return "3️⃣";
        case 4:
            return "4️⃣";
        case 5:
            return "5️⃣";
    }
}

async function featureIsUnlocked(guildId, feature, redisClient) {
    const jsonString = await redisClient.get(`functionconfig`);
    const json = JSON.parse(jsonString);
    if (json[feature].includes(guildId)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {successEmbed, failVoiceEmbed, failEmbed, recordVoiceTime, stopRecordVoiceTime, getUserFromMention, createButtons, featureIsUnlocked};