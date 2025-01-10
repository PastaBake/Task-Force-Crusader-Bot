/*
 *  file: activity.js (events/ready)
 *  authors: PastaBake & skirmishuk
 *  copyright © 2024, all rights reserved
 */

const { ActivityType, inlineCode } = require('discord.js');
const { guild, attendancechannelid } = require('../../config');

module.exports = async (client) => {
    client.user.setActivity(`Chimera Tactical Group`, { type: ActivityType.Custom });
};
