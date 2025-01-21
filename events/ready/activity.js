/*
 *  file: activity.js (events/ready)
 *  authors: PastaBake & skirmishuk
 *  copyright © 2024, all rights reserved
 */

const { ActivityType, inlineCode } = require('discord.js');
const { guild, attendancechannelid } = require('../../config');

module.exports = async (client) => {
    client.user.setActivity(`For New Events`, { type: ActivityType.Watching });

    const discordGuild = client.guilds.cache.get(guild);
    discordGuild.scheduledEvents.fetch()
        .then(events => {
        if (events.size === 0) {
            console.log('No events found.');
            return;
        };

        console.log(`Found ${events.size} event(s). Deleting them...`);

        // Iterate through the events and delete them
        events.forEach(event => {
            discordGuild.scheduledEvents.delete(event.id)
            .then(() => console.log(`Deleted event: ${event.name} (${event.id})`))
            .catch(error => console.error(`Failed to delete event: ${event.name} (${event.id})`, error));
        });
    }).catch(error => console.error('Failed to fetch events:', error));
};
