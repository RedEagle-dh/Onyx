const {ActivityType, PresenceUpdateStatus} = require("discord-api-types/v10");
module.exports = {
    name: "ready",
    once: true,
    async execute(event, redisClient, client, __Log) {
        __Log.info(`Bot is online and listening to ${event.guilds.cache.size} guilds: ${event.guilds.cache.map(g => g.name).join(", ")}`)
        event.user.setPresence({
            status: PresenceUpdateStatus.Online
        })

        const activities = [{name: "/help", type: ActivityType.Playing}, {
            name: `${event.guilds.cache.size} Server`,
            type: ActivityType.Listening
        }]
        setInterval(() => {
            event.user.setPresence({
                activities: [activities[Math.floor(Math.random() * activities.length)]],
            })
        }, 10000)

        const guild = event.guilds.cache.get("756943363093037076")
        const birthdayDoc = JSON.parse(await redisClient.get(`birthday-${guild.id}`));

        const birthdayDates = birthdayDoc.dates;
        if (!birthdayDoc) {
            return;
        }
        birthdayDates.forEach((date) => {
            const jsDate = new Date(date.date);
            if (jsDate.getMonth() === new Date().getMonth() && jsDate.getDate() === new Date().getDate() && jsDate.getFullYear() === new Date().getFullYear()) {
                guild.members.cache.find(u => u.id === date.user).roles.add(birthdayDoc.role);
                event.channels.cache.get("758700920375607306").send(`Happy birthday <@${date.user}>! <a:birthday:1017882475344703529>`);
                const index = birthdayDates.indexOf(date);
                birthdayDates[index].date = (Number(date.date.split(".")[0]) + 1) + "." + date.date.split(".")[1] + "." + date.date.split(".")[2];
                redisClient.set(`birthday-${guild.id}`, JSON.stringify(Object({enabled: birthdayDoc.enabled, role: birthdayDoc.role, channel: birthdayDoc.channel, dates: birthdayDates})));
            } else if (jsDate.getMonth() === new Date().getMonth() && jsDate.getDate() + 1 === new Date().getDate()) {
                guild.members.cache.find(u => u.id === date.user).roles.remove(birthdayDoc.role);
            }
        })


    }
}