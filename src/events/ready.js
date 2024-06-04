import { Events, ActivityType } from 'discord.js';
import { startTimers } from './../timers.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
		startTimers(client)
		client.user.setPresence({
			status: 'available',
			activities: [{
				name: 'Final Fantasy XIV',
				type: ActivityType.Watching
			}]
		})
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
}