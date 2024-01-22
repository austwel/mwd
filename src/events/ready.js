import { Events, ActivityType } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
		client.user.setPresence({
			status: 'available',
			activities: [{
				name: 'cc',
				type: ActivityType.Custom,
				state: '🏆 Ready to create scrims'
			}]
		})
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
}