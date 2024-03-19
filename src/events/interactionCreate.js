import { Events } from 'discord.js';
import { join, join1, join2, leave, remove, reset, start, presence } from '../customs.js';
import { rank } from '../queue.js'

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(`Error executing ${interaction.commandName}`);
                    console.error(error);
                }
            } else if (interaction.isButton()) {
                if (interaction.customId === 'join') {
                    await join(interaction)
                } else if (interaction.customId === 'join1') {
                    await join1(interaction)
                } else if (interaction.customId === 'join2') {
                    await join2(interaction)
                } else if (interaction.customId === 'leave') {
                    await leave(interaction)
                } else if (interaction.customId === 'start') {
                    await start(interaction)
                } else if (interaction.customId == 'remove') {
                    await remove(interaction)
                } else if (interaction.customId == 'reset') {
                    await reset(interaction)
                }
                await presence(interaction)
            } else if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'rank') {
                    await rank(interaction)
                }
            }
        } catch (err) {
            console.error(err)
        }
	},
};