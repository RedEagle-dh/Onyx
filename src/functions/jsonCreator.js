function createUserDoc(userid, welcomeMessage, messageCount, voiceSeconds, invoiceSince) {
    const jsonObj = Object({
        userid: `${userid}`,
        welcomemessage: `${welcomeMessage}`,
        messagecount: `${messageCount}`,
        voiceseconds: `${voiceSeconds}`,
        invoicesince: `${invoiceSince}`
    });
    return JSON.stringify(jsonObj);
}


function createGifDoc(gifLinks) {
    const jsonObj = Object({giflinks: [`${gifLinks}`]});
    return JSON.stringify(jsonObj);
}

function createRoleSelectionDoc(roleId, gameName, description, emoji) {
    const jsonObj = Object({
        roleid: `${roleId}`,
        gamename: `${gameName}`,
        description: `${description}`,
        emoji: `${emoji}`
    });
    return JSON.stringify(jsonObj);
}

function createVoiceSelectionDoc(voiceName, maxMembers, emoji, roleId) {
    const jsonObj = Object({
        roleid: `${roleId}`,
        voicename: `${voiceName}`,
        maxmembers: `${maxMembers}`,
        emoji: `${emoji}`
    });
    return JSON.stringify(jsonObj);
}

function createTicketSelectionDoc(ticketName, description, emoji) {
    const jsonObj = Object({ticketname: `${ticketName}`, description: `${description}`, emoji: `${emoji}`});
    return JSON.stringify(jsonObj);
}

/**
 * The function searches over the array by certain field value,
 * and replaces occurences with the parameter provided.
 *
 * @param field Name of the object field to compare
 * @param newvalue Value to replace matches with
 */
function replaceByValue(json, field, newvalue) {
    json[field] = newvalue;
    return json;
}

module.exports = {
    createUserDoc,
    createGifDoc,
    createRoleSelectionDoc,
    createVoiceSelectionDoc,
    createTicketSelectionDoc,
    replaceByValue
}